'use client';

import { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import { i18nConfig } from '@/i18n/i18nConfig';
import type { Resource } from 'i18next';

export default function I18nProvider({
  children,
  initialI18nStore,
  initialLanguage,
}: {
  children: ReactNode;
  initialI18nStore?: Resource;
  initialLanguage?: string;
}) {
  const [instance] = useState(() => {
    const instance = i18next.createInstance();
    instance
      .use(HttpBackend)
      .use(initReactI18next)
      .init({
        ...i18nConfig,
        lng: initialLanguage || i18nConfig.fallbackLng,
        resources: initialI18nStore,
        react: {
          useSuspense: true,
        },
      });
    return instance;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleLanguageChange = (lng: string) => {
        document.cookie = `i18nextLng=${lng}; path=/; max-age=31536000`;
      };

      instance.on('languageChanged', handleLanguageChange);
      return () => {
        instance.off('languageChanged', handleLanguageChange);
      };
    }
  }, [instance]);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
