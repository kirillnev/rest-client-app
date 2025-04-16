'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import './page.css';
import { useTranslation } from 'react-i18next';
import { Suspense } from 'react';

function WelcomeContent() {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (user) {
    return (
      <main className="welcome-main">
        <h1 className="welcome-title">{t('welcome.title')}</h1>
        <div className="auth-links">
          <Link href="/home" className="auth-link">
            {t('welcome.mainPage')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="welcome-main">
      <h1 className="welcome-title">{t('welcome.title')}</h1>
      <div className="auth-links">
        <Link href="/auth/signin" className="auth-link">
          {t('auth.signIn')}
        </Link>
        <Link href="/auth/signup" className="auth-link">
          {t('auth.signUp')}
        </Link>
      </div>
    </main>
  );
}

export default function Welcome() {
  return (
    <Suspense fallback={<div className="welcome-title">Loading...</div>}>
      <WelcomeContent />
    </Suspense>
  );
}
