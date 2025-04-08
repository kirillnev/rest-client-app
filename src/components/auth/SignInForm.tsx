'use client';

import { useSignIn } from '@/components/auth/hooks/useSignIn';

export const SignInForm = () => {
  const { email, password, setEmail, setPassword, error, handleSubmit } =
    useSignIn();

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="form-container"
      role="form"
    >
      <h2>Sign In</h2>

      <div className="form-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit">Sign In</button>
    </form>
  );
};
