'use client';

import dynamic from 'next/dynamic';
import Loading from '@/components/Loading';
import Nav from '@/components/Nav';
import RequireAuth from '@/components/auth/RequireAuth';

const RestClient = dynamic(() => import('@/components/RestClient'), {
  loading: () => <Loading />,
});

export default function RestPage() {
  return (
    <RequireAuth>
      <main className="welcome-main">
        <RestClient />
        <Nav />
      </main>
    </RequireAuth>
  );
}
