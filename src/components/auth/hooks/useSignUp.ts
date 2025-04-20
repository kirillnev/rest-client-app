import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getSignUpSchema, SignUpSchemaType } from '@/schemas/signUpSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useSignUp = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(getSignUpSchema(t)),
  });

  const onSubmit = async (data: SignUpSchemaType) => {
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
