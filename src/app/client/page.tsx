'use client';

import dynamic from 'next/dynamic';
import RequireAuth from '@/components/auth/RequireAuth';
import Loading from '@/components/Loading';

const RestClient = dynamic(() => import('@/components/RestClient'), {
  loading: () => <Loading />,
  ssr: false,
});

export default function ClientPage() {
  return (
    <RequireAuth>
      <RestClient />
    </RequireAuth>
  );
}
