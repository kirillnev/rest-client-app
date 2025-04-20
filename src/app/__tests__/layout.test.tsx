import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout from '../layout';

jest.mock('@/components/Header/Header', () => ({
  __esModule: true,
  default: () => <header data-testid="header">Header</header>,
}));

jest.mock('@/components/Footer/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

jest.mock('@/components/providers/I18nProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="i18n-provider">{children}</div>
  ),
}));

jest.mock('@/i18n/getServerLanguage', () => ({
  getServerLanguage: jest.fn(() => Promise.resolve('en')),
}));

jest.mock('@/i18n/i18nServer', () => ({
  initI18nServer: jest.fn(() =>
    Promise.resolve({
      services: {
        resourceStore: {
          data: {
            en: { translation: { test: 'Test' } },
          },
        },
      },
    })
  ),
}));

describe('RootLayout', () => {
  it('renders children, header, and footer wrapped in providers', async () => {
    const content = await RootLayout({
      children: <div data-testid="content">Page Content</div>,
    });

    render(content);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('i18n-provider')).toBeInTheDocument();
  });
});
