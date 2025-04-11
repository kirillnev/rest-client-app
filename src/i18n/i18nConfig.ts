// src/I18n/I18nConfig.tsx
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
  // debug: process.env.NODE_ENV === 'development',
};
