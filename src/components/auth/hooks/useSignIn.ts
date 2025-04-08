import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { signInSchema } from '@/schemas/signInSchema';
import type { AuthError } from '@supabase/supabase-js';
import { ZodError } from 'zod';

export const useSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      signInSchema.parse({ email, password });

      const { error: authError }: { error: AuthError | null } =
        await supabase.auth.signInWithPassword({ email, password });

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

  return {
    email,
    password,
    setEmail,
    setPassword,
    error,
    handleSubmit,
  };
};
