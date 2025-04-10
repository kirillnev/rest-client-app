import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { signInSchema } from '@/schemas/signInSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { AuthError } from '@supabase/supabase-js';
import { z } from 'zod';
import { useState } from 'react';

export type SignInFormData = z.infer<typeof signInSchema>;

export const useSignIn = () => {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    const { email, password } = data;

    const { error: supabaseError }: { error: AuthError | null } =
      await supabase.auth.signInWithPassword({ email, password });

    if (supabaseError) {
      setAuthError(supabaseError.message);
    } else {
      setAuthError(null);
      router.push('/');
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    authError,
  };
};
