import { renderHook, act } from '@testing-library/react';
import { useSignUp } from '../useSignUp';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { SignUpFormData } from '../useSignUp';
import { signUpSchema } from '@/schemas/signUpSchema';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('useSignUp (react-hook-form version)', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('should fail zod validation for invalid input', () => {
    const result = signUpSchema.safeParse({
      email: 'invalid-email',
      password: '',
      confirmPassword: '',
      agreement: false,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message).join(' ');

      expect(messages).toMatch(/email/i);
      expect(messages).toMatch(/password/i);
      expect(messages).toMatch(/agree/i);
    }
  });

  it('should set authError if Supabase returns an error', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      error: { message: 'Email already exists' },
    });

    const { result } = renderHook(() => useSignUp());

    const validData: SignUpFormData = {
      email: 'test@mail.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      agreement: true,
    };

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(result.current.authError).toBe('Email already exists');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should redirect to / on successful signup', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      error: null,
    });

    const { result } = renderHook(() => useSignUp());

    const validData: SignUpFormData = {
      email: 'test@mail.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      agreement: true,
    };

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(result.current.authError).toBe(null);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
