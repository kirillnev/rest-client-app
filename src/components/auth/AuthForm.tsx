'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { AuthError } from '@supabase/supabase-js';

type AuthFormProps = {
  mode: 'signin' | 'signup';
};

export const AuthForm = ({ mode }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const passwordValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
      password
    );
    if (!passwordValid) {
      setError(
        'Password must be 8+ characters, include a letter, number, and special character.'
      );
      setLoading(false);
      return;
    }

    let authError: AuthError | null = null;

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      authError = error;
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      authError = error;
    }

    if (authError) {
      setError(authError.message);
    } else {
      router.push('/');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};
