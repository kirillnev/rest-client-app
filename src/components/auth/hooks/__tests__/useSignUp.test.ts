import { renderHook, act } from '@testing-library/react';
import { useSignUp } from '../useSignUp';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { SignUpSchemaType } from '@/schemas/signUpSchema';
import { getSignUpSchema } from '@/schemas/signUpSchema';
import type { TFunction } from 'i18next';

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

  const t = ((key: string) => {
    const messages: Record<string, string> = {
      'auth.validation.email': 'Invalid email',
      'auth.validation.password.min': 'Password must be at least 8 characters',
      'auth.validation.password.letter': 'Password must contain a letter',
      'auth.validation.password.digit': 'Password must contain a digit',
      'auth.validation.password.special':
        'Password must contain a special character',
      'auth.validation.password.match': 'Passwords do not match',
      'auth.validation.agreement': 'You must agree to the terms',
    };
    return messages[key] || key;
  }) as unknown as TFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('should fail zod validation for invalid input', () => {
    const schema = getSignUpSchema(t);

    const result = schema.safeParse({
      email: 'invalid-email',
      password: '',
      confirmPassword: '',
      agreement: false,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message).join(' ');

      expect(messages).toMatch(/invalid email/i);
      expect(messages).toMatch(/password/i);
      expect(messages).toMatch(/agree/i);
    }
  });

  it('should set authError if Supabase returns an error', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      error: { message: 'Email already exists' },
    });

    const { result } = renderHook(() => useSignUp());

    const validData: SignUpSchemaType = {
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

    const validData: SignUpSchemaType = {
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
