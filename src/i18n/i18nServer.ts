// src/i18n/i18nServer.ts
import i18next from 'i18next';
import fs from 'fs';
import path from 'path';
import { i18nConfig } from './i18nConfig';

const LANGUAGES = ['en', 'ru', 'de'];
const NAMESPACE = 'translation';

export const getResources = () => {
  const resources: Record<string, any> = {};

  for (const lang of LANGUAGES) {
    const filePath = path.resolve(
      process.cwd(),
      `public/locales/${lang}/${NAMESPACE}.json`
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
  });

  return i18n;
}
