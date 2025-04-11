// app/rest-client/page.tsx
'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import RestClient from '@/components/RestClient/RestClient';
import RequireAuth from '@/components/auth/RequireAuth';
import { useAuth } from '@/contexts/AuthContext';
import './rest-client.css';

export default function ClientPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <RequireAuth>
      <main className="rest-client-main">
        <h1 className="welcome-back-title">
          {t('welcome.back', {
            username: user?.email?.split('@')[0] || 'User',
          })}
        </h1>
        <nav className="nav-links">
          <Link href="/rest-client" className="nav-link">
            {t('nav.restClient')}
          </Link>
          <Link href="/history" className="nav-link">
            {t('nav.history')}
          </Link>
          <Link href="/variables" className="nav-link">
            {t('nav.variables')}
          </Link>
        </nav>
        <RestClient />
      </main>
    </RequireAuth>
  );
}
