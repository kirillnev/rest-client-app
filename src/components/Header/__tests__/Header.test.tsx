import { render, screen, fireEvent, act } from '@testing-library/react';
import Header from '../Header';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: jest.fn().mockResolvedValue({}),
    },
  },
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('Header', () => {
  const mockUseAuth = {
    user: null,
    loading: false,
  };

  const mockUseTranslation = {
    t: (key: string) => {
      const translations: Record<string, string> = {
        'nav.language': 'Language',
        'nav.restClient': 'REST Client',
        'auth.signIn': 'Sign In',
        'auth.signUp': 'Sign Up',
        'auth.signOut': 'Sign Out',
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);
    (useTranslation as jest.Mock).mockReturnValue(mockUseTranslation);
  });

  it('renders logo, language toggle, and auth buttons', () => {
    render(<Header />);
    expect(screen.getByAltText('REST Client')).toHaveAttribute(
      'src',
      expect.stringContaining('logo-rbr')
    );
    expect(screen.getByText('Language: EN')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toHaveAttribute('href', '/auth/signin');
    expect(screen.getByText('Sign Up')).toHaveAttribute('href', '/auth/signup');
  });

  it('opens and closes language dropdown', async () => {
    render(<Header />);
    expect(screen.queryByText('RU')).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('Language: EN'));
    });

    expect(screen.getByText('RU')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('RU'));
    });

    expect(screen.queryByText('RU')).not.toBeInTheDocument();
  });

  it('calls signOut when clicking sign out button', async () => {
    const mockSignOut = supabase.auth.signOut;
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      loading: false,
    });

    render(<Header />);
    await act(async () => {
      fireEvent.click(screen.getByText('Sign Out'));
    });
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('applies is-sticky class when scrolled', async () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    render(<Header />);
    expect(screen.getByRole('banner')).not.toHaveClass('is-sticky');

    await act(async () => {
      window.scrollY = 60;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByRole('banner')).toHaveClass('is-sticky');
  });
});
