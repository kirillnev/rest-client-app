import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { signUpSchema } from '@/schemas/signUpSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { z } from 'zod';

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const useSignUp = () => {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setAuthError(null);
    const { email, password } = data;

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setAuthError(authError.message);
    } else {
      reset();
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
