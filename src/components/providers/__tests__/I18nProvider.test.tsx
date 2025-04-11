import { render, screen } from '@testing-library/react';
import I18nProvider from '@/components/providers/I18nProvider';
import i18next from 'i18next';

jest.mock('i18next', () => {
  const mockInstance = {
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockResolvedValue(undefined),
    isInitialized: false,
    language: 'en',
    on: jest.fn(),
    off: jest.fn(),
    changeLanguage: jest.fn(),
  };
  return {
    createInstance: jest.fn().mockReturnValue(mockInstance),
  };
});

jest.mock('react-i18next', () => ({
  I18nextProvider: jest.fn(({ children }) => (
    <div data-testid="mock-i18n">{children}</div>
  )),
  initReactI18next: jest.fn(),
}));

describe('I18nProvider', () => {
  let cookieValue = '';

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(global.document, 'cookie', {
      get: () => cookieValue,
      set: (value) => {
        cookieValue = value;
      },
      configurable: true,
    });
  });

  afterEach(() => {
    cookieValue = '';
  });

  it('renders children inside I18nextProvider', () => {
    render(
      <I18nProvider>
        <span>Test Child</span>
      </I18nProvider>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(screen.getByTestId('mock-i18n')).toBeInTheDocument();
  });

  it('initializes i18n if not initialized', () => {
    const i18nInstance = i18next.createInstance();
    render(
      <I18nProvider initialLanguage="ru">
        <div />
      </I18nProvider>
    );
    expect(i18nInstance.init).toHaveBeenCalledWith({
      fallbackLng: 'en',
      supportedLngs: ['en', 'ru', 'de'],
      defaultNS: 'translation',
      backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
      interpolation: { escapeValue: false },
      lng: 'ru',
      resources: undefined,
    });
  });

  it('sets cookie with initial language on mount', () => {
    const i18nInstance = i18next.createInstance();
    i18nInstance.language = 'ru';
    render(
      <I18nProvider initialLanguage="ru">
        <div />
      </I18nProvider>
    );
    expect(document.cookie).toBe('i18nextLng=ru; path=/; max-age=31536000');
  });

  it('sets cookie on language change', () => {
    const i18nInstance = i18next.createInstance();
    let languageChangeCallback: (lng: string) => void;
    (i18nInstance.on as jest.Mock).mockImplementation(
      (event: string, cb: (lng: string) => void) => {
        if (event === 'languageChanged') languageChangeCallback = cb;
      }
    );
    render(
      <I18nProvider initialLanguage="en">
        <div />
      </I18nProvider>
    );
    languageChangeCallback!('de');
    expect(document.cookie).toBe('i18nextLng=de; path=/; max-age=31536000');
  });

  it('uses cookie language if available', () => {
    cookieValue = 'i18nextLng=ru';
    const i18nInstance = i18next.createInstance();
    render(
      <I18nProvider initialLanguage="en">
        <div />
      </I18nProvider>
    );
    expect(i18nInstance.init).toHaveBeenCalledWith(
      expect.objectContaining({ lng: 'ru' })
    );
  });

  it('falls back to initialLanguage if no cookie', () => {
    cookieValue = '';
    const i18nInstance = i18next.createInstance();
    render(
      <I18nProvider initialLanguage="de">
        <div />
      </I18nProvider>
    );
    expect(i18nInstance.init).toHaveBeenCalledWith(
      expect.objectContaining({ lng: 'de' })
    );
  });

  it('falls back to config fallbackLng if no cookie or initialLanguage', () => {
    cookieValue = '';
    const i18nInstance = i18next.createInstance();
    render(
      <I18nProvider>
        <div />
      </I18nProvider>
    );
    expect(i18nInstance.init).toHaveBeenCalledWith(
      expect.objectContaining({ lng: 'en' })
    );
  });
});
