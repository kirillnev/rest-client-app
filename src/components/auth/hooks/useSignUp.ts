import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { signUpSchema } from '@/schemas/signUpSchema';
import { ZodError } from 'zod';

export const useSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      signUpSchema.parse({ email, password, confirmPassword, agreement });

      const { error: authError } = await supabase.auth.signUp({ email, password });

      if (authError) {
        setError(authError.message);
      } else {
        router.push('/client');
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
    confirmPassword,
    agreement,
    setEmail,
    setPassword,
    setConfirmPassword,
    setAgreement,
    error,
    handleSubmit,
  };
};
