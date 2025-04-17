'use client';

import dynamic from 'next/dynamic';
import RequireAuth from '@/components/auth/RequireAuth';
import Loading from '@/components/Loading';

const HistorySection = dynamic(() => import('@/components/History/History'), {
  loading: () => <Loading />,
  ssr: false,
});

export default function HistoryPage() {
  return (
    <RequireAuth>
      <HistorySection />
    </RequireAuth>
  );
}
