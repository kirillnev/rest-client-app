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
  const mockT = jest.fn();
  const mockUseAuth = {
    user: null,
  };

  beforeEach(() => {
    mockT.mockImplementation((key) => {
      switch (key) {
        case 'welcome.features':
          return ['Feature 1', 'Feature 2'];
        case 'welcome.text':
          return 'Welcome text';
        case 'welcome.title':
          return 'Welcome!';
        case 'auth.signIn':
          return 'Sign In';
        case 'auth.signUp':
          return 'Sign Up';
        case 'welcome.loggedInText':
          return ['<b>Welcome back!</b>', '<i>Enjoy your stay.</i>'];
        default:
          return key;
      }
    });

    (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
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

    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByText('Welcome text')).toBeInTheDocument();
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toHaveAttribute('href', '/auth/signin');
    expect(screen.getByText('Sign Up')).toHaveAttribute('href', '/auth/signup');
  });

  it('renders correctly for authenticated user', () => {
    (useAuth as jest.Mock).mockReturnValueOnce({
      user: { email: 'test@example.com' },
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <Welcome />
      </Suspense>
    );

    expect(
      screen.getByText(
        (content, element) =>
          element?.tagName.toLowerCase() === 'h1' &&
          content.includes('Welcome') &&
          content.includes('test')
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(screen.getByText('Enjoy your stay.')).toBeInTheDocument();

    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });

  it('shows loading fallback while suspended', () => {
    const Suspend = () => {
      throw new Promise(() => {}); // заставляет Suspense отрисовать fallback
    };

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <Suspend />
      </Suspense>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
