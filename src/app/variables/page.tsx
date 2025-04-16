'use client';

import RequireAuth from '@/components/auth/RequireAuth';
import Variables from '@/components/Variables';

export default function HistoryPage() {
  return (
    <RequireAuth>
      <Variables />
    </RequireAuth>
  );
}
