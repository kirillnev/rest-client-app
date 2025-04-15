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
        {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          {...register('password')}
        />
        {errors.password && (
          <p style={{ color: 'red' }}>{errors.password.message}</p>
        )}
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="Confirm Password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p style={{ color: 'red' }}>{errors.confirmPassword.message}</p>
        )}
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
        {errors.agreement && (
          <p style={{ color: 'red' }}>{errors.agreement.message}</p>
        )}
      </div>

      {authError && <p style={{ color: 'red' }}>{authError}</p>}

      <button type="submit">Sign Up</button>
    </form>
  );
};
