import { render, screen, fireEvent, act } from '@testing-library/react';
import Header from '../Header';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
// import { ImgHTMLAttributes } from 'react';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';

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

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
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

  const mockPush = jest.fn();
  const mockRouter = { push: mockPush };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);
    (useTranslation as jest.Mock).mockReturnValue(mockUseTranslation);
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders logo, language toggle, and auth buttons', () => {
    render(
      <MemoryRouterProvider>
        <Header />
      </MemoryRouterProvider>
    );
    expect(screen.getByText('Language: EN')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toHaveAttribute('href', '/auth/signin');
    expect(screen.getByText('Sign Up')).toHaveAttribute('href', '/auth/signup');
  });

  it('opens and closes language dropdown', async () => {
    render(
      <MemoryRouterProvider>
        <Header />
      </MemoryRouterProvider>
    );
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
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      loading: false,
    });

    render(
      <MemoryRouterProvider>
        <Header />
      </MemoryRouterProvider>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Sign Out'));
    });
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/signin');
  });

  it('applies is-sticky class when scrolled', async () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    render(
      <MemoryRouterProvider>
        <Header />
      </MemoryRouterProvider>
    );
    expect(screen.getByRole('banner')).not.toHaveClass('is-sticky');

    await act(async () => {
      window.scrollY = 60;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.getByRole('banner')).toHaveClass('is-sticky');
  });
});
