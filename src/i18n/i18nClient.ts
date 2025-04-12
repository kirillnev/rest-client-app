import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { i18nConfig } from './i18nConfig';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ...i18nConfig,
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      caches: ['cookie'],
      lookupCookie: 'i18nextLng',
      cookieMinutes: 60 * 24 * 30,
      cookieDomain:
        typeof window !== 'undefined' ? window.location.hostname : 'localhost',
    },
  });

export default i18n;
