export const i18nConfig = {
  fallbackLng: 'en',
  supportedLngs: ['en', 'ru', 'de'],
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['cookie', 'localStorage', 'navigator'],
    caches: ['cookie'],
    cookieName: 'i18nextLng',
  },
};
