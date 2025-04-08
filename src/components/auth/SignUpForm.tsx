'use client';

import { useSignUp } from '@/components/auth/hooks/useSignUp';

export const SignUpForm = () => {
  const {
    email,
    password,
    confirmPassword,
    agreement,
    setEmail,
    setPassword,
    setConfirmPassword,
    setAgreement,
    error,
    handleSubmit,
  } = useSignUp();

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="form-container"
      role="form"
    >
      <h2>Sign Up</h2>

      <div className="form-group">
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={agreement}
            onChange={(e) => setAgreement(e.target.checked)}
          />
          I agree to the terms
        </label>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit">Sign Up</button>
    </form>
  );
};
