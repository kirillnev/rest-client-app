import RestClient from '@/components/RestClient/RestClient';
import RequireAuth from '@/components/auth/RequireAuth';

export default function ClientPage() {
  return (
    <RequireAuth>
      <RestClient />
    </RequireAuth>
  );
}
