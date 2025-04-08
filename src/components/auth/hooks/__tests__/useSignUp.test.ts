import { renderHook, act } from '@testing-library/react';
import { useSignUp } from '../useSignUp';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { ZodError } from 'zod';

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

jest.mock('@/schemas/signUpSchema', () => {
  const actual = jest.requireActual('@/schemas/signUpSchema');
  return {
    ...actual,
    signUpSchema: {
      ...actual.signUpSchema,
      parse: jest.fn(),
    },
  };
});

describe('useSignUp', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('should update email, password, confirmPassword and agreement', () => {
    const { result } = renderHook(() => useSignUp());

    act(() => {
      result.current.setEmail('test@mail.com');
      result.current.setPassword('Password123!');
      result.current.setConfirmPassword('Password123!');
      result.current.setAgreement(true);
    });

    expect(result.current.email).toBe('test@mail.com');
    expect(result.current.password).toBe('Password123!');
    expect(result.current.confirmPassword).toBe('Password123!');
    expect(result.current.agreement).toBe(true);
  });

  it('should show Zod error for invalid input', async () => {
    (signUpSchema.parse as jest.Mock).mockImplementation(() => {
      throw new ZodError([
        {
          code: 'custom',
          path: ['email'],
          message: 'Invalid email',
        },
      ]);
    });

    const { result } = renderHook(() => useSignUp());

    await act(async () => {
      const fakeEvent = {
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent;
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.error.toLowerCase()).toContain('invalid email');
  });

  it('should set error if Supabase returns an error', async () => {
    (signUpSchema.parse as jest.Mock).mockImplementation(() => {});
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      error: { message: 'Email already exists' },
    });

    const { result } = renderHook(() => useSignUp());

    act(() => {
      result.current.setEmail('test@mail.com');
      result.current.setPassword('Password123!');
      result.current.setConfirmPassword('Password123!');
      result.current.setAgreement(true);
    });

    await act(async () => {
      const fakeEvent = {
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent;
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.error).toBe('Email already exists');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should redirect to / on successful signup', async () => {
    (signUpSchema.parse as jest.Mock).mockImplementation(() => {});
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      error: null,
    });

    const { result } = renderHook(() => useSignUp());

    act(() => {
      result.current.setEmail('test@mail.com');
      result.current.setPassword('Password123!');
      result.current.setConfirmPassword('Password123!');
      result.current.setAgreement(true);
    });

    await act(async () => {
      const fakeEvent = {
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent;
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.error).toBe('');
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should set a generic error if an unexpected error occurs', async () => {
    (signUpSchema.parse as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const { result } = renderHook(() => useSignUp());

    await act(async () => {
      const fakeEvent = {
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent;
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.error).toBe('Something went wrong');
  });
});
