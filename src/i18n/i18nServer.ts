import i18next from 'i18next';
import { i18nConfig } from './i18nConfig';
import type { Resource } from 'i18next';
import en from '../../locales/en/translation.json';
import ru from '../../locales/ru/translation.json';
import de from '../../locales/de/translation.json';

export const getResources = (): Resource => {
  return {
    en: { translation: en },
    ru: { translation: ru },
    de: { translation: de },
  };
};

export async function initI18nServer(language: string) {
  const i18n = i18next.createInstance();

  await i18n.init({
    ...i18nConfig,
    lng: language,
    resources: getResources(),
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      caches: ['cookie'],
    },
  });

  return i18n;
}
