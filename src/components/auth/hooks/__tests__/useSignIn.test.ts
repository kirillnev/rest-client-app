import { renderHook, act } from '@testing-library/react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useSignIn } from '../useSignIn';
import type { SignInFormData } from '../useSignIn';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('useSignIn (react-hook-form version)', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('should set authError if Supabase returns error', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      error: { message: 'Invalid credentials' },
    });

    const { result } = renderHook(() => useSignIn());

    const formData: SignInFormData = {
      email: 'user@example.com',
      password: 'wrongpassword',
    };

    await act(async () => {
      await result.current.onSubmit(formData);
    });

    expect(result.current.authError).toBe('Invalid credentials');
  });

  it('should set authError if Supabase returns error', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      error: { message: 'Invalid credentials' },
    });

    const { result } = renderHook(() => useSignIn());

    await act(async () => {
      await result.current.onSubmit({
        email: 'user@example.com',
        password: 'Password123!',
      });
    });

    expect(result.current.authError).toBe('Invalid credentials');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should redirect to / on successful login', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      error: null,
    });

    const { result } = renderHook(() => useSignIn());

    await act(async () => {
      await result.current.onSubmit({
        email: 'user@example.com',
        password: 'Password123!',
      });
    });

    expect(result.current.authError).toBe(null);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
