'use client';

import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import RequireAuth from '@/components/auth/RequireAuth';
import './rest-client.css';
import WelcomeREST from '@/components/WelcomeREST/WelcomeREST';
import Loading from '@/components/Loading';
import { useState } from 'react';

const RestClient = dynamic(() => import('@/components/RestClient'), {
  loading: () => <Loading />,
});
const Variables = dynamic(() => import('@/components/Variables'), {
  loading: () => <Loading />,
});
const History = dynamic(() => import('@/components/History'), {
  loading: () => <Loading />,
});

type Tab = 'home' | 'client' | 'history' | 'variables';

export default function ClientPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'client':
        return <RestClient />;
      case 'history':
        return <History />;
      case 'variables':
        return <Variables />;
      default:
        return <WelcomeREST />;
    }
  };

  return (
    <RequireAuth>
      <main className="rest-client-main">
        {renderContent()}
        <nav className="nav-links">
          <button className="nav-link" onClick={() => setActiveTab('client')}>
            {t('nav.restClient')}
          </button>
          <button className="nav-link" onClick={() => setActiveTab('history')}>
            {t('nav.history')}
          </button>
          <button
            className="nav-link"
            onClick={() => setActiveTab('variables')}
          >
            {t('nav.variables')}
          </button>
        </nav>
      </main>
    </RequireAuth>
  );
}
