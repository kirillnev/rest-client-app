'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export const useHeaderLogic = (stickyThreshold: number = 10) => {
  const { user, loading } = useAuth();
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const [isSticky, setIsSticky] = useState(false);
  const languages = ['en', 'ru', 'de'];

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > stickyThreshold);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stickyThreshold]);

  useEffect(() => {
    const onLangChange = (lng: string) => setSelectedLang(lng);
    i18n.on('languageChanged', onLangChange);
    return () => {
      i18n.off('languageChanged', onLangChange);
    };
  }, [i18n]);

  const toggleLangOpen = () => setIsLangOpen((prev) => !prev);

  const handleLangSelect = (lang: string) => {
    i18n.changeLanguage(lang);
    Cookies.set('i18nextLng', lang);
    setSelectedLang(i18n.language);
    setIsLangOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth/signin');
    } catch {
      router.push('/auth/signin');
    }
  };

  return {
    user,
    loading,
    handleSignOut,
    isLangOpen,
    selectedLang,
    languages,
    handleLangSelect,
    toggleLangOpen,
    isSticky,
    t,
  };
};
