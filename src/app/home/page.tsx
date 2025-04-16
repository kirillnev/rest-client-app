'use client';

import Nav from '@/components/Nav';
import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';
import RequireAuth from '@/components/auth/RequireAuth';

const WelcomeREST = dynamic(() => import('@/components/WelcomeREST'), {
  loading: () => <Loading />,
});

export default function HomePage() {
  return (
    <RequireAuth>
      <main className="welcome-main">
        <WelcomeREST />
        <Nav />
      </main>
    </RequireAuth>
  );
}
