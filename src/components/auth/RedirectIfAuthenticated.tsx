'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Props = {
  children: React.ReactNode;
};

export default function RedirectIfAuthenticated({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/client');
      }
    });
  }, [router]);

  return <>{children}</>;
}
