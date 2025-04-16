import { render, screen, waitFor } from '@testing-library/react';
import RequireAuth from '../RequireAuth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('RequireAuth', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
  });

  it('renders the Loading component when loading is true', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: true,
    });

    render(
      <RequireAuth>
        <div>Protected content</div>
      </RequireAuth>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('redirects to /auth/signin if not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <RequireAuth>
        <div>Protected content</div>
      </RequireAuth>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/auth/signin');
    });
  });

  it('renders children if user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
    });

    render(
      <RequireAuth>
        <div>Protected content</div>
      </RequireAuth>
    );

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });
});
