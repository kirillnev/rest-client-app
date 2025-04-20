'use client';

import { useSignIn } from '@/components/auth/hooks/useSignIn';
import { useTranslation } from 'react-i18next';

export const SignInForm = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, onSubmit, errors, authError } = useSignIn();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="form-container"
      role="form"
    >
      <h2>{t('auth.signIn')}</h2>

      <div className="form-group">
        <input
          type="email"
          placeholder={t('auth.emailPlaceholder')}
          {...register('email')}
        />
        <p className="form-error">{errors.email?.message || '\u00A0'}</p>
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder={t('auth.passwordPlaceholder')}
          {...register('password')}
        />
        <p className="form-error">{errors.password?.message || '\u00A0'}</p>
      </div>

      {authError && <p style={{ color: 'red' }}>{authError}</p>}

      <button type="submit">{t('auth.signIn')}</button>
    </form>
  );
};
