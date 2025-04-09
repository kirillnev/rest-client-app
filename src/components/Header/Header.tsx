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
          <button onClick={handleSignOut} className="btn-signout">
            Sign out
          </button>
        </>
      ) : (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link
            href="/auth/signin"
            style={{ fontStyle: 'italic', textDecoration: 'underline' }}
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            style={{ fontStyle: 'italic', textDecoration: 'underline' }}
          >
            Sign up
          </Link>
        </div>
      )}
      <p>HEADER</p>
    </section>
  );
}
