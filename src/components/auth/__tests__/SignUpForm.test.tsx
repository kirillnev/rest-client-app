import { render, screen, fireEvent } from '@testing-library/react';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { useSignUp } from '@/components/auth/hooks/useSignUp';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'auth.signUp': 'Sign Up',
        'auth.emailPlaceholder': 'Email',
        'auth.passwordPlaceholder': 'Password',
        'auth.confirmPasswordPlaceholder': 'Confirm Password',
        'auth.agreementLabel': 'I agree to the',
        'auth.termsLink': 'terms',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('@/components/auth/hooks/useSignUp');

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
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

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
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

    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.getByText('Too short')).toBeInTheDocument();
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    expect(screen.getByText('You must agree to the terms')).toBeInTheDocument();
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
    expect(screen.getByText('Email already exists')).toBeInTheDocument();
  });
});
