import RootLayout from '../layout';
import { render } from '@testing-library/react';
import { getServerLanguage } from '@/i18n/getServerLanguage';
import { initI18nServer } from '@/i18n/i18nServer';
import { i18n, Resource } from 'i18next';

jest.mock('@/i18n/getServerLanguage');
jest.mock('@/i18n/i18nServer');
jest.mock('@/components/Header/Header', () => {
  const Header = () => <div>Header</div>;
  Header.displayName = 'Header';
  return Header;
});

jest.mock('@/components/Footer/Footer', () => {
  const Footer = () => <div>Footer</div>;
  Footer.displayName = 'Footer';
  return Footer;
});
jest.mock('@/components/providers/I18nProvider', () => {
  const I18nProvider = ({
    children,
    initialLanguage,
  }: {
    children: React.ReactNode;
    initialI18nStore: Resource;
    initialLanguage: string;
  }) => (
    <div>
      <div>I18nProvider: {initialLanguage}</div>
      {children}
    </div>
  );
  I18nProvider.displayName = 'I18nProvider';
  return I18nProvider;
});

jest.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>AuthProvider{children}</div>
  ),
}));

describe('RootLayout', () => {
  const mockGetServerLanguage = getServerLanguage as jest.MockedFunction<
    typeof getServerLanguage
  >;
  const mockInitI18nServer = initI18nServer as jest.MockedFunction<
    typeof initI18nServer
  >;

  beforeEach(() => {
    mockGetServerLanguage.mockResolvedValue('ru');
    mockInitI18nServer.mockResolvedValue({
      services: {
        resourceStore: {
          data: { ru: { translation: {} } } as Resource,
        },
      },
    } as i18n);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with language and providers', async () => {
    const Layout = await RootLayout({ children: <div>Test Content</div> });
    const { findByText } = render(Layout);

    expect(await findByText('Header')).toBeInTheDocument();
    expect(await findByText('Footer')).toBeInTheDocument();
    expect(await findByText('Test Content')).toBeInTheDocument();
    expect(await findByText('AuthProvider')).toBeInTheDocument();
    expect(await findByText('I18nProvider: ru')).toBeInTheDocument();
  });

  it('calls getServerLanguage and initI18nServer', async () => {
    await RootLayout({ children: <div>Test</div> });

    expect(mockGetServerLanguage).toHaveBeenCalledWith('en');
    expect(mockInitI18nServer).toHaveBeenCalledWith('ru');
  });

  it('returns html with correct lang attribute', async () => {
    const Layout = await RootLayout({ children: <div>Test</div> });

    expect(Layout.props.lang).toBe('ru');
    expect(Layout.type).toBe('html');
  });
});
