//useHeaderLogic.ts
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface HeaderLogic {
  user: User | null;
  loading: boolean;
  handleSignOut: () => Promise<void>;
  isLangOpen: boolean;
  selectedLang: string;
  languages: string[];
  handleLangSelect: (lang: string) => void;
  toggleLangOpen: () => void;
  isSticky: boolean;
}

export const useHeaderLogic = (
  initialLang: string = 'en',
  stickyThreshold: number = 50
): HeaderLogic => {
  const { user, loading } = useAuth();

  const handleSignOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    // Редирект обрабатывается в AuthContext
  };

  const { i18n } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<string>(
    i18n.language || initialLang
  );
  const languages: string[] = ['en', 'ru', 'de'];

  const handleLangSelect = (lang: string): void => {
    i18n.changeLanguage(lang);
    setSelectedLang(lang);
    setIsLangOpen(false);
  };

  const toggleLangOpen = (): void => {
    setIsLangOpen((prev) => !prev);
  };

  const [isSticky, setIsSticky] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > stickyThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stickyThreshold]);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setSelectedLang(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

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
  };
};
