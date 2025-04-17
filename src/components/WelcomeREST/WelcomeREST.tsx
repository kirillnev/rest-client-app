'use client';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

export default function WelcomeREST() {
  const { user } = useAuth();
  const { t } = useTranslation();
  return (
    <>
      <h1 className="welcome-back-title">
        {t('welcome.back', {
          username: user?.email?.split('@')[0] || 'User',
        })}
      </h1>
      <h3>Здесь вы сможете отправлять запросы к любым API, бла, бла, бла...</h3>
    </>
  );
}
