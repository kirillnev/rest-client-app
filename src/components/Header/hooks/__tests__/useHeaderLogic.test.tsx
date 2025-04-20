import { renderHook, act } from '@testing-library/react';
import { useHeaderLogic } from '../useHeaderLogic';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

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

jest.mock('js-cookie', () => ({
  set: jest.fn(),
  get: jest.fn(),
}));

describe('useHeaderLogic', () => {
  const mockUseAuth = {
    user: null,
    loading: false,
  };

  const mockT = jest.fn();
  const mockChangeLanguage = jest.fn();
  const mockOn = jest.fn();
  const mockOff = jest.fn();

  const mockI18n = {
    language: 'en',
    changeLanguage: mockChangeLanguage,
    on: mockOn,
    off: mockOff,
  };

  const mockPush = jest.fn();
  const mockRouter = { push: mockPush };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);
    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
      i18n: mockI18n,
    });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useHeaderLogic());
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.isLangOpen).toBe(false);
    expect(result.current.selectedLang).toBe('en');
    expect(result.current.languages).toEqual(['en', 'ru', 'de']);
    expect(result.current.isSticky).toBe(false);
  });

  it('toggles language dropdown', () => {
    const { result } = renderHook(() => useHeaderLogic());
    act(() => {
      result.current.toggleLangOpen();
    });
    expect(result.current.isLangOpen).toBe(true);
    act(() => {
      result.current.toggleLangOpen();
    });
    expect(result.current.isLangOpen).toBe(false);
  });

  it('syncs selectedLang with i18n.language', () => {
    const languageChangedCallback = jest.fn();
    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
      i18n: {
        ...mockI18n,
        language: 'en',
        on: jest.fn((event, cb) => {
          if (event === 'languageChanged') {
            cb('de');
            languageChangedCallback();
          }
        }),
      },
    });

    const { result } = renderHook(() => useHeaderLogic());
    expect(result.current.selectedLang).toBe('de');
    expect(languageChangedCallback).toHaveBeenCalled();
  });

  it('calls signOut and redirects', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      loading: false,
    });

    const { result } = renderHook(() => useHeaderLogic());
    await act(async () => {
      await result.current.handleSignOut();
    });
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/signin');
  });

  it('handles signOut error and redirects', async () => {
    (supabase.auth.signOut as jest.Mock).mockRejectedValue(
      new Error('Sign out failed')
    );
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      loading: false,
    });

    const { result } = renderHook(() => useHeaderLogic());
    await act(async () => {
      await result.current.handleSignOut();
    });
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/signin');
  });

  it('sets isSticky based on scroll position', () => {
    const originalWindow = { ...window };
    const scrollYMock = jest.fn();
    Object.defineProperty(window, 'scrollY', {
      get: scrollYMock,
      configurable: true,
    });

    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { result, unmount } = renderHook(() => useHeaderLogic(10));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    );
    const handleScroll = addEventListenerSpy.mock.calls[0][1] as EventListener;

    scrollYMock.mockReturnValue(0);
    act(() => {
      handleScroll(new Event('scroll'));
    });
    expect(result.current.isSticky).toBe(false);

    scrollYMock.mockReturnValue(30);
    act(() => {
      handleScroll(new Event('scroll'));
    });
    expect(result.current.isSticky).toBe(true);

    scrollYMock.mockReturnValue(5);
    act(() => {
      handleScroll(new Event('scroll'));
    });
    expect(result.current.isSticky).toBe(false);

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', handleScroll);

    Object.defineProperty(window, 'scrollY', {
      value: originalWindow.scrollY,
      configurable: true,
    });
  });
});
