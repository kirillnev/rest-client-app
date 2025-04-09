import { render, screen, waitFor } from '@testing-library/react';
import RedirectIfAuthenticated from '@/components/auth/RedirectIfAuthenticated';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('RedirectIfAuthenticated', () => {
  const replaceMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: replaceMock });
  });

  it('redirects to /client if session exists', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: '123' } } },
    });

    render(
      <RedirectIfAuthenticated>
        <div>Test content</div>
      </RedirectIfAuthenticated>
    );

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/');
    });
  });

  it('renders children if no session', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
    });

    render(
      <RedirectIfAuthenticated>
        <div>Visible content</div>
      </RedirectIfAuthenticated>
    );

    await waitFor(() => {
      expect(screen.getByText('Visible content')).toBeInTheDocument();
    });

    expect(replaceMock).not.toHaveBeenCalled();
  });
});
