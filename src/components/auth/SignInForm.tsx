'use client';

import { useSignIn } from '@/components/auth/hooks/useSignIn';

export const SignInForm = () => {
  const { register, handleSubmit, onSubmit, errors, authError } = useSignIn();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="form-container"
      role="form"
    >
      <h2>Sign In</h2>

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

      {authError && <p style={{ color: 'red' }}>{authError}</p>}

      <button type="submit">Sign In</button>
    </form>
  );
};
