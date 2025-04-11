// src/components/providers/I18nProvider.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import { i18nConfig } from '@/i18n/i18nConfig';

const i18nInstance = i18next.createInstance();

const getCookieLang = () => {
  if (typeof window === 'undefined') return null;
  const cookies = document.cookie.split(';').map((cookie) => cookie.trim());
  const lngCookie = cookies.find((cookie) => cookie.startsWith('i18nextLng='));
  return lngCookie ? lngCookie.split('=')[1] : null;
};

export default function I18nProvider({
  children,
  initialI18nStore,
  initialLanguage,
}: {
  children: ReactNode;
  initialI18nStore?: Record<string, any>;
  initialLanguage?: string;
}) {
  const storedLang = getCookieLang();

  if (!i18nInstance.isInitialized) {
    i18nInstance
      .use(HttpBackend)
      .use(initReactI18next)
      .init({
        ...i18nConfig,
        lng: storedLang || initialLanguage || i18nConfig.fallbackLng,
        resources: initialI18nStore,
      });
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialLng = i18nInstance.language;
      document.cookie = `i18nextLng=${initialLng}; path=/; max-age=31536000`;

      i18nInstance.on('languageChanged', (lng) => {
        document.cookie = `i18nextLng=${lng}; path=/; max-age=31536000`;
      });

      return () => {
        i18nInstance.off('languageChanged');
      };
    }
  }, []);

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}
