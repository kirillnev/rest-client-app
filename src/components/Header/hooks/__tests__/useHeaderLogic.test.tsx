import { renderHook, act } from '@testing-library/react';
import { useHeaderLogic } from '../useHeaderLogic';
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

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);
    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
      i18n: mockI18n,
    });
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

  it('calls signOut', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      loading: false,
    });

    const { result } = renderHook(() => useHeaderLogic());
    await act(async () => {
      await result.current.handleSignOut();
    });
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('sets isSticky based on scroll position', async () => {
    let scrollY = 0;

    Object.defineProperty(window, 'scrollY', {
      get: () => scrollY,
      configurable: true,
    });

    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { result, unmount } = renderHook(() => useHeaderLogic(50));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    );
    const handleScroll = addEventListenerSpy.mock.calls[0][1] as EventListener;

    expect(result.current.isSticky).toBe(false);

    await act(() => {
      scrollY = 30;
      handleScroll(new Event('scroll'));
    });
    expect(result.current.isSticky).toBe(false);

    await act(() => {
      scrollY = 60;
      handleScroll(new Event('scroll'));
    });
    expect(result.current.isSticky).toBe(true);

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', handleScroll);
  });
});
