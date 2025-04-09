import { render, screen, fireEvent } from '@testing-library/react';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { useSignUp } from '@/components/auth/hooks/useSignUp';

jest.mock('@/components/auth/hooks/useSignUp');

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

describe('SignUpForm (RHF)', () => {
  const mockHandleSubmit = jest.fn((fn: () => void) => () => fn());
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useSignUp as jest.Mock).mockReturnValue({
      register: jest.fn(() => ({})),
      handleSubmit: mockHandleSubmit,
      onSubmit: mockOnSubmit,
      errors: {},
      authError: null,
    });
  });

  it('renders all input fields and the submit button', () => {
    render(<SignUpForm />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm password/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it('calls handleSubmit and onSubmit on form submit', () => {
    render(<SignUpForm />);
    fireEvent.submit(screen.getByRole('form'));
    expect(mockHandleSubmit).toHaveBeenCalled();
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('displays field-level validation errors', () => {
    (useSignUp as jest.Mock).mockReturnValueOnce({
      register: jest.fn(() => ({})),
      handleSubmit: mockHandleSubmit,
      onSubmit: mockOnSubmit,
      errors: {
        email: { message: 'Invalid email' },
        password: { message: 'Too short' },
        confirmPassword: { message: 'Passwords do not match' },
        agreement: { message: 'You must agree to the terms' },
      },
      authError: null,
    });

    render(<SignUpForm />);

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    expect(screen.getByText(/too short/i)).toBeInTheDocument();
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    expect(
      screen.getByText(/you must agree to the terms/i)
    ).toBeInTheDocument();
  });

  it('displays backend auth error message', () => {
    (useSignUp as jest.Mock).mockReturnValueOnce({
      register: jest.fn(() => ({})),
      handleSubmit: mockHandleSubmit,
      onSubmit: mockOnSubmit,
      errors: {},
      authError: 'Email already exists',
    });

    render(<SignUpForm />);
    expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
  });
});
