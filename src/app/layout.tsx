import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import I18nProvider from '@/components/providers/I18nProvider';
import { ReactNode } from 'react';
import { initI18nServer } from '@/i18n/i18nServer';
import { getServerLanguage } from '@/i18n/getServerLanguage';
import ClientErrorBoundaryWrapper from '@/components/providers/ClientErrorBoundaryWrapper';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'RBrains REST Client',
  icons: {
    icon: '/favicon.png',
  },
};

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
        <div className="corner-decoration" />
        <AuthProvider>
          <I18nProvider
            initialI18nStore={i18n.services.resourceStore.data}
            initialLanguage={lng}
          >
            <ClientErrorBoundaryWrapper>
              <Header />
              <div className="main-content">{children}</div>
              <Footer />
            </ClientErrorBoundaryWrapper>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
