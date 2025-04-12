import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

export default function Variables() {
  const { user } = useAuth();
  const { t } = useTranslation();
  return (
    <>
      <h1 className="welcome-back-title">
        {t('welcome.back', {
          username: user?.email?.split('@')[0] || 'User',
        })}
      </h1>
      <h3>Здесь управление переменными, бла, бла, бла...</h3>
    </>
  );
}
