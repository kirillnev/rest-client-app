'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import './page.css';

function WelcomeContent() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const features = t('welcome.features', { returnObjects: true }) as string[];

  if (user) {
    return (
      <main className="welcome-main">
        <h1 className="welcome-title">{t('welcome.title')}</h1>
        <div className="auth-links">
          <Link href="/client" className="auth-link">
            {t('welcome.mainPage')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="welcome-main">
      <h1 className="welcome-title">{t('welcome.title')}</h1>
      <p className="welcome-text">{t('welcome.text')}</p>
      <ul className="welcome-features-list">
        {features.map((item, i) => (
          <li key={i} className="welcome-feature-item">
            {item}
          </li>
        ))}
      </ul>
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
