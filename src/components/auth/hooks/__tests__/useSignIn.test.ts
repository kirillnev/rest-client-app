import { renderHook, act } from '@testing-library/react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useSignIn } from '../useSignIn';
import { signInSchema } from '@/schemas/signInSchema';
import type { FormEvent } from 'react';

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

describe('useSignIn', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('should update email and password', () => {
    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.setEmail('user@example.com');
      result.current.setPassword('Password123!');
    });

    expect(result.current.email).toBe('user@example.com');
    expect(result.current.password).toBe('Password123!');
  });

  it('should set error if credentials are invalid (ZodError)', async () => {
    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.setEmail('invalid-email');
      result.current.setPassword('');
    });

    await act(async () => {
      const fakeEvent = {
        preventDefault: jest.fn(),
      } as unknown as FormEvent<HTMLFormElement>;
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.error.toLowerCase()).toContain('email');
  });

  it('should set error if Supabase returns error', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      error: { message: 'Invalid credentials' },
    });

    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.setEmail('test@mail.com');
      result.current.setPassword('Password123!');
    });

    await act(async () => {
      const fakeEvent = {
        preventDefault: jest.fn(),
      } as unknown as FormEvent<HTMLFormElement>;
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.error).toBe('Invalid credentials');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should redirect to / on success', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      error: null,
    });

    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.setEmail('test@mail.com');
      result.current.setPassword('Password123!');
    });

    await act(async () => {
      const fakeEvent = {
        preventDefault: jest.fn(),
      } as unknown as FormEvent<HTMLFormElement>;
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.error).toBe('');
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should set a generic error if an unexpected error occurs', async () => {
    const parseMock = jest
      .spyOn(signInSchema, 'parse')
      .mockImplementation(() => {
        throw new Error('Unexpected');
      });

    const { result } = renderHook(() => useSignIn());

    act(() => {
      result.current.setEmail('test@mail.com');
      result.current.setPassword('Password123!');
    });

    await act(async () => {
      const fakeEvent = {
        preventDefault: jest.fn(),
      } as unknown as FormEvent<HTMLFormElement>;
      await result.current.handleSubmit(fakeEvent);
    });

    expect(result.current.error).toBe('Something went wrong');
    parseMock.mockRestore();
  });
});
