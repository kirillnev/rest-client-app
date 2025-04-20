import { render, screen, fireEvent } from '@testing-library/react';
import { SignInForm } from '@/components/auth/SignInForm';
import { useSignIn } from '@/components/auth/hooks/useSignIn';

jest.mock('@/components/auth/hooks/useSignIn');

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'auth.signIn': 'Sign In',
        'auth.emailPlaceholder': 'Email',
        'auth.passwordPlaceholder': 'Password',
      };
      return map[key] || key;
    },
  }),
}));

describe('SignInForm (with react-hook-form)', () => {
  const mockHandleSubmit = jest.fn((fn: () => void) => () => fn());
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useSignIn as jest.Mock).mockReturnValue({
      register: jest.fn(() => ({})),
      handleSubmit: mockHandleSubmit,
      onSubmit: mockOnSubmit,
      errors: {},
      authError: null,
    });
  });

  it('renders form inputs and submit button', () => {
    render(<SignInForm />);

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('calls handleSubmit and onSubmit on form submit', () => {
    render(<SignInForm />);

    fireEvent.submit(screen.getByRole('form'));

    expect(mockHandleSubmit).toHaveBeenCalled();
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('displays field validation errors', () => {
    (useSignIn as jest.Mock).mockReturnValueOnce({
      register: jest.fn(() => ({})),
      handleSubmit: mockHandleSubmit,
      onSubmit: mockOnSubmit,
      errors: {
        email: { message: 'Invalid email format' },
        password: { message: 'Password too short' },
      },
      authError: null,
    });

    render(<SignInForm />);

    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    expect(screen.getByText('Password too short')).toBeInTheDocument();
  });

  it('displays auth error from backend', () => {
    (useSignIn as jest.Mock).mockReturnValueOnce({
      register: jest.fn(() => ({})),
      handleSubmit: mockHandleSubmit,
      onSubmit: mockOnSubmit,
      errors: {},
      authError: 'Invalid credentials',
    });

    render(<SignInForm />);
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
