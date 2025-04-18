import React from 'react';
import { render, screen } from '@testing-library/react';
import SignInPage from '../../app/auth/signin/page';

jest.mock('@/components/auth/SignInForm', () => ({
  __esModule: true,
  SignInForm: () => <div data-testid="signin-form">Sign In Form</div>,
}));

jest.mock('@/components/auth/RedirectIfAuthenticated', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('SignInPage', () => {
  it('renders SignInForm inside RedirectIfAuthenticated', () => {
    render(<SignInPage />);
    expect(screen.getByTestId('signin-form')).toBeInTheDocument();
  });
});
