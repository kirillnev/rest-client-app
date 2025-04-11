import { initI18nServer, getResources } from '../i18nServer';
import fs from 'fs';
import path from 'path';
import { i18nConfig } from '../i18nConfig';

jest.mock('fs');
jest.mock('path', () => ({
  resolve: jest.fn((...args) => args.join('/')),
}));

describe('i18nServer', () => {
  const mockTranslations = {
    en: { translation: { hello: 'Hello' } },
    ru: { translation: { hello: 'Привет' } },
    de: { translation: { hello: 'Hallo' } },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.readFileSync as jest.Mock).mockImplementation((filePath) => {
      const lang = filePath.split('/')[filePath.split('/').length - 2];
      return JSON.stringify(
        mockTranslations[lang as keyof typeof mockTranslations].translation
      );
    });
    (path.resolve as jest.Mock).mockImplementation((...args) => args.join('/'));
  });

  describe('getResources', () => {
    it('loads resources for all supported languages', () => {
      const resources = getResources();
      expect(resources).toEqual(mockTranslations);
      expect(fs.readFileSync).toHaveBeenCalledTimes(3);
      expect(fs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('public/locales/en/translation.json'),
        'utf-8'
      );
      expect(fs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('public/locales/ru/translation.json'),
        'utf-8'
      );
      expect(fs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('public/locales/de/translation.json'),
        'utf-8'
      );
    });
  });

  describe('initI18nServer', () => {
    it('initializes i18n with provided language and resources', async () => {
      const i18n = await initI18nServer('ru');
      expect(i18n.language).toBe('ru');
      expect(i18n.options.fallbackLng).toEqual(['en']);
      expect(i18n.options.supportedLngs).toEqual(['en', 'ru', 'de', 'cimode']);
      expect(i18n.options.defaultNS).toBe(i18nConfig.defaultNS);
      expect(i18n.options.resources).toEqual(mockTranslations);
    });

    it('initializes i18n with default resources for all languages', async () => {
      const i18n = await initI18nServer('de');
      expect(i18n.t('hello')).toBe('Hallo');
      expect(i18n.options.resources).toHaveProperty('en');
      expect(i18n.options.resources).toHaveProperty('ru');
      expect(i18n.options.resources).toHaveProperty('de');
    });

    it('uses fallback language if provided language is not supported', async () => {
      const i18n = await initI18nServer('fr');
      expect(i18n.language).toBe('fr');
      expect(i18n.t('hello')).toBe('Hello');
    });
  });
});
