'use client';
import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';
import RequireAuth from '@/components/auth/RequireAuth';

const RestClient = dynamic(() => import('@/components/RestClient'), {
  loading: () => <Loading />,
});

export default function ClientPage() {
  return (
    <RequireAuth>
      <RestClient />
    </RequireAuth>
  );
}
