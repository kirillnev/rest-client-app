'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Suspense, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import './page.css';

function WelcomeContent() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/client');
    }
  }, [user, router]);

  if (user) {
    return null; // Редирект в процессе
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
    <Suspense fallback={<div>Loading...</div>}>
      <WelcomeContent />
    </Suspense>
  );
}
