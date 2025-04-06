'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { AuthError } from '@supabase/supabase-js';
import { authSchema } from '@/schemas/authSchema';
import { ZodError } from 'zod';

type AuthFormProps = {
  mode: 'signin' | 'signup';
};

export const AuthForm = ({ mode }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      authSchema.parse({ email, password });

      let authError: AuthError | null = null;

      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        authError = error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        authError = error;
      }

      if (authError) {
        setError(authError.message);
      } else {
        router.push('/');
      }
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0].message);
      } else {
        setError('Something went wrong');
      }
    }
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
      <button type="submit">
        {mode === 'signin' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};
