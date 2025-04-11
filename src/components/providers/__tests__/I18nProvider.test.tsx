import { render, screen } from '@testing-library/react';
import I18nProvider from '@/components/providers/I18nProvider';
import i18next from 'i18next';
import { InitOptions, Resource } from 'i18next';
import { act } from 'react';

type LanguageChangedCallback = (lng: string) => void;

jest.mock('i18next', () => {
  const mockInstance = {
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockImplementation((options: InitOptions) => {
      mockInstance.language = options.lng || 'en';
      mockInstance.services = {
        resourceStore: {
          data: options.resources || ({} as Resource),
        },
      };
      return Promise.resolve(mockInstance);
    }),
    isInitialized: false,
    language: 'en',
    on: jest.fn((event: string, callback: LanguageChangedCallback) => {
      if (event === 'languageChanged') {
        mockInstance.languageChangedCallback = callback;
      }
    }),
    off: jest.fn(),
    changeLanguage: jest.fn().mockImplementation((lng: string) => {
      mockInstance.language = lng;
      if (mockInstance.languageChangedCallback) {
        mockInstance.languageChangedCallback(lng);
      }
      return Promise.resolve(mockInstance);
    }),
    services: {
      resourceStore: {
        data: {},
      },
    },
    languageChangedCallback: null as LanguageChangedCallback | null,
  };

  return {
    createInstance: jest.fn(() => mockInstance),
  };
});

jest.mock('react-i18next', () => ({
  I18nextProvider: jest.fn(({ children }) => children),
  initReactI18next: jest.fn(),
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('I18nProvider', () => {
  let cookieValue = '';

  beforeEach(() => {
    jest.clearAllMocks();
    cookieValue = '';

    Object.defineProperty(global.document, 'cookie', {
      get: () => cookieValue,
      set: (value: string) => {
        cookieValue = value;
      },
      configurable: true,
    });
  });

  it('renders children', () => {
    render(
      <I18nProvider>
        <span>Test Child</span>
      </I18nProvider>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('initializes i18n with correct config', async () => {
    const i18nInstance = i18next.createInstance();

    await act(async () => {
      render(
        <I18nProvider initialLanguage="ru" initialI18nStore={{}}>
          <div />
        </I18nProvider>
      );
    });

    expect(i18nInstance.init).toHaveBeenCalledWith({
      fallbackLng: 'en',
      supportedLngs: ['en', 'ru', 'de'],
      defaultNS: 'translation',
      backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
      interpolation: { escapeValue: false },
      detection: {
        order: ['cookie', 'localStorage', 'navigator'],
        caches: ['cookie'],
        cookieName: 'i18nextLng',
      },
      lng: 'ru',
      resources: {},
      react: { useSuspense: true },
    });
  });

  it('sets cookie on language change', async () => {
    const i18nInstance = i18next.createInstance();

    await act(async () => {
      render(
        <I18nProvider initialLanguage="en">
          <div />
        </I18nProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await i18nInstance.changeLanguage('de');
    });

    expect(document.cookie).toContain('i18nextLng=de');
  });

  it('falls back to initialLanguage if no cookie', async () => {
    const i18nInstance = i18next.createInstance();

    await act(async () => {
      render(
        <I18nProvider initialLanguage="de">
          <div />
        </I18nProvider>
      );
    });

    expect(i18nInstance.init).toHaveBeenCalledWith(
      expect.objectContaining({ lng: 'de' })
    );
  });

  it('falls back to config fallbackLng if no cookie or initialLanguage', async () => {
    const i18nInstance = i18next.createInstance();

    await act(async () => {
      render(
        <I18nProvider>
          <div />
        </I18nProvider>
      );
    });

    expect(i18nInstance.init).toHaveBeenCalledWith(
      expect.objectContaining({ lng: 'en' })
    );
  });
});
