import React from 'react';
import { render, screen } from '@testing-library/react';
import Welcome from '../../app/page';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Suspense } from 'react';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('Welcome Component', () => {
  const mockT = jest.fn((key) => key);
  const mockUseAuth = {
    user: null,
  };

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
    });

    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly for unauthenticated user', () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <Welcome />
      </Suspense>
    );

    expect(screen.getByText('welcome.title')).toBeInTheDocument();
    expect(screen.getByText('auth.signIn')).toBeInTheDocument();
    expect(screen.getByText('auth.signUp')).toBeInTheDocument();
    expect(screen.queryByText('welcome.mainPage')).not.toBeInTheDocument();
  });

  it('renders correctly for authenticated user', () => {
    (useAuth as jest.Mock).mockReturnValueOnce({
      user: { id: '123', name: 'Test User' },
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <Welcome />
      </Suspense>
    );

    expect(screen.getByText('welcome.title')).toBeInTheDocument();
    expect(screen.getByText('welcome.mainPage')).toBeInTheDocument();
    expect(screen.queryByText('auth.signIn')).not.toBeInTheDocument();
    expect(screen.queryByText('auth.signUp')).not.toBeInTheDocument();
  });

  it('shows loading state when suspended', () => {
    (useTranslation as jest.Mock).mockReturnValueOnce({
      t: () => new Promise(() => {}),
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <Welcome />
      </Suspense>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('has correct links for unauthenticated user', () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <Welcome />
      </Suspense>
    );

    const signInLink = screen.getByText('auth.signIn').closest('a');
    const signUpLink = screen.getByText('auth.signUp').closest('a');

    expect(signInLink).toHaveAttribute('href', '/auth/signin');
    expect(signUpLink).toHaveAttribute('href', '/auth/signup');
  });

  it('has correct link for authenticated user', () => {
    (useAuth as jest.Mock).mockReturnValueOnce({
      user: { id: '123', name: 'Test User' },
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <Welcome />
      </Suspense>
    );

    const mainPageLink = screen.getByText('welcome.mainPage').closest('a');
    expect(mainPageLink).toHaveAttribute('href', '/home');
  });
});
