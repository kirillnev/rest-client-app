import { initI18nServer, getResources } from '../i18nServer';
import { i18nConfig } from '../i18nConfig';

describe('i18nServer', () => {
  describe('getResources', () => {
    it('loads resources for all supported languages', () => {
      const resources = getResources();

      expect(resources).toHaveProperty('en');
      expect(resources).toHaveProperty('ru');
      expect(resources).toHaveProperty('de');

      expect(resources.ru.translation).toHaveProperty(
        'welcome.title',
        'Добро пожаловать'
      );
    });
  });

  describe('initI18nServer', () => {
    it('initializes i18n with provided language and resources', async () => {
      const i18n = await initI18nServer('ru');

      expect(i18n.language).toBe('ru');
      expect([i18n.options.fallbackLng].flat()).toContain('en');
      expect(i18n.options.supportedLngs).toEqual(
        expect.arrayContaining(['en', 'ru', 'de'])
      );
      expect(i18n.options.defaultNS).toBe(i18nConfig.defaultNS);

      expect(i18n.options.resources).toHaveProperty('ru');
      expect(i18n.t('welcome.title')).toBe('Добро пожаловать');
    });

    it('initializes i18n with default resources for all languages', async () => {
      const i18n = await initI18nServer('de');

      expect(i18n.t('auth.signIn')).toBe('Anmelden');
      expect(i18n.options.resources).toHaveProperty('en');
      expect(i18n.options.resources).toHaveProperty('ru');
      expect(i18n.options.resources).toHaveProperty('de');
    });

    it('uses fallback language if provided language is not supported', async () => {
      const i18n = await initI18nServer('fr');

      expect(i18n.language).toBe('fr');
      expect(i18n.t('auth.signIn')).toBe('Sign In');
    });
  });
});
