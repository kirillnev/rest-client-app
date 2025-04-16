'use client';

import RequireAuth from '@/components/auth/RequireAuth';
import RestClient from '@/components/RestClient';

export default function HistoryPage() {
  return (
    <RequireAuth>
      <RestClient />
    </RequireAuth>
  );
}
