import React from 'react';
import { render, screen } from '@testing-library/react';
import SignUpPage from '../../app/auth/signup/page';

jest.mock('@/components/auth/SignUpForm', () => ({
  __esModule: true,
  SignUpForm: () => <div data-testid="signup-form">Sign Up Form</div>,
}));

jest.mock('@/components/auth/RedirectIfAuthenticated', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('SignUpPage', () => {
  it('renders SignUpForm inside RedirectIfAuthenticated', () => {
    render(<SignUpPage />);
    expect(screen.getByTestId('signup-form')).toBeInTheDocument();
  });
});
