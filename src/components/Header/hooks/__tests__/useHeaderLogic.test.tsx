import { renderHook, act } from '@testing-library/react';
import { useHeaderLogic } from '../useHeaderLogic';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

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

  const mockUseTranslation = {
    t: jest.fn(),
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

  it('changes selected language', () => {
    const { result } = renderHook(() => useHeaderLogic());
    act(() => {
      result.current.handleLangSelect('ru');
    });
    expect(mockUseTranslation.i18n.changeLanguage).toHaveBeenCalledWith('ru');
    expect(result.current.selectedLang).toBe('ru');
    expect(result.current.isLangOpen).toBe(false);
  });

  it('syncs selectedLang with i18n.language', () => {
    const mockOn = jest.fn().mockImplementation((event, callback) => {
      if (event === 'languageChanged') callback('de');
    });
    (useTranslation as jest.Mock).mockReturnValue({
      ...mockUseTranslation,
      i18n: { ...mockUseTranslation.i18n, on: mockOn },
    });

    const { result } = renderHook(() => useHeaderLogic());
    expect(result.current.selectedLang).toBe('de');
  });

  it('calls signOut', async () => {
    const mockSignOut = supabase.auth.signOut;
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      loading: false,
    });

    const { result } = renderHook(() => useHeaderLogic());
    await act(async () => {
      await result.current.handleSignOut();
    });
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('sets isSticky based on scroll position', async () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { result, unmount } = renderHook(() => useHeaderLogic('en', 50));
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    );
    const handleScroll = addEventListenerSpy.mock.calls[0][1] as EventListener;

    expect(result.current.isSticky).toBe(false);

    await act(async () => {
      window.scrollY = 30;
      handleScroll(new Event('scroll'));
    });
    expect(result.current.isSticky).toBe(false);

    await act(async () => {
      window.scrollY = 60;
      handleScroll(new Event('scroll'));
    });
    expect(result.current.isSticky).toBe(true);

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', handleScroll);
  });
});
