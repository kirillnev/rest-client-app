import i18next from 'i18next';
import fs from 'fs';
import path from 'path';
import { i18nConfig } from './i18nConfig';
import type { Resource } from 'i18next';

const LANGUAGES = ['en', 'ru', 'de'];
const NAMESPACE = 'translation';

export const getResources = () => {
  const resources: Resource = {};

  for (const lang of LANGUAGES) {
    const filePath = path.resolve(
      process.cwd(),
      `locales/${lang}/${NAMESPACE}.json`
    );
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    resources[lang] = {
      [NAMESPACE]: JSON.parse(fileContent),
    };
  }

  return resources;
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
