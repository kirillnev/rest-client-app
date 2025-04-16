'use client';

import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';
import Nav from '@/components/Nav';
import RequireAuth from '@/components/auth/RequireAuth';

const VariablesComponent = dynamic(() => import('@/components/Variables'), {
  loading: () => <Loading />,
});

export default function VariablesPage() {
  return (
    <RequireAuth>
      <main className="welcome-main">
        <VariablesComponent />
        <Nav />
      </main>
    </RequireAuth>
  );
}
