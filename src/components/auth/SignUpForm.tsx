'use client';

import { useSignUp } from '@/components/auth/hooks/useSignUp';
import { useTranslation } from 'react-i18next';

export const SignUpForm = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, onSubmit, errors, authError } = useSignUp();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="form-container"
      role="form"
    >
      <h2>{t('auth.signUp')}</h2>

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

      <div className="form-group">
        <input
          type="password"
          placeholder={t('auth.confirmPasswordPlaceholder')}
          {...register('confirmPassword')}
        />
        <p className="form-error">
          {errors.confirmPassword?.message || '\u00A0'}
        </p>
      </div>

      <div className="form-group">
        <label>
          <input type="checkbox" {...register('agreement')} />
          {t('auth.agreementLabel')}{' '}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="terms-link"
          >
            {t('auth.termsLink')}
          </a>
        </label>
        <p className="form-error">{errors.agreement?.message || '\u00A0'}</p>
      </div>

      {authError && <p style={{ color: 'red' }}>{authError}</p>}

      <button type="submit">{t('auth.signUp')}</button>
    </form>
  );
};
