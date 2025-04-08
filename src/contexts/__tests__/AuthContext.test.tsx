import { act, render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const MockComponent = () => {
  const { user, session, loading } = useAuth();
  return (
    <div>
      <p data-testid="user">{user?.email || 'no-user'}</p>
      <p data-testid="session">{session ? 'session-present' : 'no-session'}</p>
      <p data-testid="loading">{loading ? 'loading' : 'not-loading'}</p>
    </div>
  );
};

describe('AuthProvider', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('sets user and session on mount', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: {
        session: {
          user: { email: 'test@example.com' },
        },
      },
    });

    (supabase.auth.onAuthStateChange as jest.Mock).mockImplementation(() => ({
      data: { subscription: { unsubscribe: jest.fn() } },
    }));

    render(
      <AuthProvider>
        <MockComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('session')).toHaveTextContent(
        'session-present'
      );
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });
  });

  it('clears user and redirects on SIGNED_OUT event', async () => {
    let authCallback: (
      _event: AuthChangeEvent,
      _session: Session | null
    ) => void;

    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
    });

    (supabase.auth.onAuthStateChange as jest.Mock).mockImplementation(
      (callback) => {
        authCallback = callback;
        return {
          data: { subscription: { unsubscribe: jest.fn() } },
        };
      }
    );

    render(
      <AuthProvider>
        <MockComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    await act(async () => {
      authCallback?.('SIGNED_OUT', null);
    });

    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
