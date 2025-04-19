import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getSignInSchema, SignInSchemaType } from '@/schemas/signInSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useSignIn = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(getSignInSchema(t)),
  });

  const onSubmit = async (data: SignInSchemaType) => {
    const { email, password } = data;

    const { error: supabaseError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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
