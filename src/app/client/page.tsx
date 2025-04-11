'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import RestClient from '@/components/RestClient/RestClient';
import RequireAuth from '@/components/auth/RequireAuth';
import './rest-client.css';
import WelcomeREST from '@/components/WelcomeREST/WelcomeREST';

export default function ClientPage() {
  const { t } = useTranslation();

  return (
    <RequireAuth>
      <main className="rest-client-main">
        <WelcomeREST />
        <div>Это интерефейс самого REST Клиента.</div>
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
