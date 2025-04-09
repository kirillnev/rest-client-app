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

describe('SignUpForm', () => {
  const mockHandleSubmit = jest.fn();
  const mockSetEmail = jest.fn();
  const mockSetPassword = jest.fn();
  const mockSetConfirmPassword = jest.fn();
  const mockSetAgreement = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useSignUp as jest.Mock).mockReturnValue({
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      agreement: true,
      error: '',
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
      setConfirmPassword: mockSetConfirmPassword,
      setAgreement: mockSetAgreement,
      handleSubmit: mockHandleSubmit,
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

  it('calls setter functions on input change', () => {
    render(<SignUpForm />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'new@email.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: 'NewPassword1!' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: 'NewPassword1!' },
    });
    fireEvent.click(screen.getByRole('checkbox'));

    expect(mockSetEmail).toHaveBeenCalledWith('new@email.com');
    expect(mockSetPassword).toHaveBeenCalledWith('NewPassword1!');
    expect(mockSetConfirmPassword).toHaveBeenCalledWith('NewPassword1!');
    expect(mockSetAgreement).toHaveBeenCalledWith(false); // чекбокс был true — стал false
  });

  it('calls handleSubmit on form submit', () => {
    render(<SignUpForm />);
    fireEvent.submit(screen.getByRole('form'));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('displays error message if error exists', () => {
    (useSignUp as jest.Mock).mockReturnValueOnce({
      email: '',
      password: '',
      confirmPassword: '',
      agreement: false,
      error: 'Email already exists',
      setEmail: mockSetEmail,
      setPassword: mockSetPassword,
      setConfirmPassword: mockSetConfirmPassword,
      setAgreement: mockSetAgreement,
      handleSubmit: mockHandleSubmit,
    });

    render(<SignUpForm />);
    expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
  });
});
