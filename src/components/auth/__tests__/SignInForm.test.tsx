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

describe('SignInForm', () => {
  const mockHandleSubmit = jest.fn();
  const mockSetEmail = jest.fn();
  const mockSetPassword = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useSignIn as jest.Mock).mockReturnValue({
      email: 'test@example.com',
      password: 'Password123!',
      error: '',
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
      handleSubmit: mockHandleSubmit,
    });
  });

  it('renders form inputs and submit button', () => {
    render(<SignInForm />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('calls setEmail and setPassword on input change', () => {
    render(<SignInForm />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'new@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'NewPassword1!' },
    });

    expect(mockSetEmail).toHaveBeenCalledWith('new@email.com');
    expect(mockSetPassword).toHaveBeenCalledWith('NewPassword1!');
  });

  it('calls handleSubmit on form submit', () => {
    render(<SignInForm />);

    fireEvent.submit(screen.getByRole('form') || screen.getByRole('button'));

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('displays error message if error exists', () => {
    (useSignIn as jest.Mock).mockReturnValueOnce({
      email: '',
      password: '',
      error: 'Invalid credentials',
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
      handleSubmit: mockHandleSubmit,
    });

    render(<SignInForm />);

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
