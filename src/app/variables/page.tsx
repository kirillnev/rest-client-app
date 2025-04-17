'use client';

import dynamic from 'next/dynamic';
import RequireAuth from '@/components/auth/RequireAuth';
import Loading from '@/components/Loading';

const Variables = dynamic(() => import('@/components/Variables'), {
  loading: () => <Loading />,
  ssr: false,
});

export default function VariablesPage() {
  return (
    <RequireAuth>
      <Variables />
    </RequireAuth>
  );
}
