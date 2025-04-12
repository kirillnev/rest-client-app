export const i18nConfig = {
  fallbackLng: 'en',
  supportedLngs: ['en', 'ru', 'de'],
  defaultNS: 'translation',
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['cookie', 'localStorage', 'navigator'],
    caches: ['cookie'],
    cookieName: 'i18nextLng',
  },
  // debug: process.env.NODE_ENV === 'development',
};
