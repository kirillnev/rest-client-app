'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return null;

  return (
    <section>
      <p>HEADER</p>
      {user ? (
        <>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleSignOut} style={{ marginTop: '0.5rem' }}>
            Sign out
          </button>
        </>
      ) : (
        <Link
          href="/auth/signin"
          style={{ fontStyle: 'italic', textDecoration: 'underline' }}
        >
          Sign in
        </Link>
      )}
      <p>HEADER</p>
    </section>
  );
}
