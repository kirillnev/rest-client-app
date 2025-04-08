'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function ClientPage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <main style={{ padding: '2rem' }}>
      {user ? (
        <section>
          <h1>Welcome Back, {user.email}!</h1>
          {/* <RestClient /> */}
        </section>
      ) : (
        <section>
          <h1>Welcome!</h1>
          <div style={{ marginTop: '1rem' }}>
            <Link href="/auth/signin" style={{ marginRight: '1rem' }}>
              Sign In
            </Link>
            <Link href="/auth/signup">Sign Up</Link>
          </div>
        </section>
      )}
    </main>
  );
}
