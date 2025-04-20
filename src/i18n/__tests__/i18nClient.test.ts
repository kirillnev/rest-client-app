import i18n from '../i18nClient';

describe('i18n Client', () => {
  test('initializes correctly', async () => {
    await i18n.init();
    expect(i18n.isInitialized).toBeTruthy();
  });
});
