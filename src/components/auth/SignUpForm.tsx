'use client';

import { useSignUp } from '@/components/auth/hooks/useSignUp';

export const SignUpForm = () => {
  const { register, handleSubmit, onSubmit, errors, authError } = useSignUp();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="form-container"
      role="form"
    >
      <h2>Sign Up</h2>

      <div className="form-group">
        <input type="email" placeholder="Email" {...register('email')} />
        <p className="form-error">{errors.email?.message || '\u00A0'}</p>
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          {...register('password')}
        />
        <p className="form-error">{errors.password?.message || '\u00A0'}</p>
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="Confirm Password"
          {...register('confirmPassword')}
        />
        <p className="form-error">
          {errors.confirmPassword?.message || '\u00A0'}
        </p>
      </div>

      <div className="form-group">
        <label>
          <input type="checkbox" {...register('agreement')} />I agree to the
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="terms-link"
          >
            terms
          </a>
        </label>
        <p className="form-error">{errors.agreement?.message || '\u00A0'}</p>
      </div>

      {authError && <p style={{ color: 'red' }}>{authError}</p>}

      <button type="submit">Sign Up</button>
    </form>
  );
};
