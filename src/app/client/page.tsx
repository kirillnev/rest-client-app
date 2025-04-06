'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function ClientPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <main style={{ padding: '2rem' }}>
      {email ? (
        <section>
          <h1>Welcome Back, {email}!</h1>
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
