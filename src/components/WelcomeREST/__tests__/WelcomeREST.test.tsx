import { render, screen } from '@testing-library/react';
import WelcomeREST from '../WelcomeREST';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('WelcomeREST', () => {
  const mockUseAuth = useAuth as jest.Mock;
  const mockUseTranslation = useTranslation as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTranslation.mockReturnValue({
      t: jest.fn((key, options) => {
        if (key === 'welcome.back') {
          return `Welcome back, ${options.username}!`;
        }
        return key;
      }),
    });
  });

  it('renders welcome message with username from email', () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com' },
    });

    render(<WelcomeREST />);
    expect(screen.getByText('Welcome back, test!')).toBeInTheDocument();
  });

  it('renders welcome message with fallback username when user is null', () => {
    mockUseAuth.mockReturnValue({
      user: null,
    });

    render(<WelcomeREST />);
    expect(screen.getByText('Welcome back, User!')).toBeInTheDocument();
  });
});
