// src/app/layout.tsx
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import I18nProvider from '@/components/providers/I18nProvider';
import { ReactNode } from 'react';
import { initI18nServer } from '@/i18n/i18nServer';
import { getServerLanguage } from '@/i18n/getServerLanguage';

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const lng = await getServerLanguage('en');
  const i18n = await initI18nServer(lng);

  return (
    <html lang={lng}>
      <body className="layout-body">
        <AuthProvider>
          <I18nProvider
            initialI18nStore={i18n.services.resourceStore.data}
            initialLanguage={lng}
          >
            <Header />
            <div className="main-content">{children}</div>
            <Footer />
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
