import { getServerLanguage } from '../getServerLanguage';
import { cookies } from 'next/headers';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('getServerLanguage', () => {
  // const supportedLngs = ['en', 'ru', 'de'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns language from cookie if it is supported', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'ru' }),
    });

    const result = await getServerLanguage('en');
    expect(result).toBe('ru');
    expect(cookies).toHaveBeenCalled();
  });

  it('returns default language if cookie language is not supported', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'fr' }),
    });

    const result = await getServerLanguage('en');
    expect(result).toBe('en');
  });

  it('returns default language if cookie is not set', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    const result = await getServerLanguage('en');
    expect(result).toBe('en');
  });

  it('returns custom default language if provided and cookie is not set', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    const result = await getServerLanguage('de');
    expect(result).toBe('de');
  });

  it('returns cookie language over default if both are supported', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: 'ru' }),
    });

    const result = await getServerLanguage('de');
    expect(result).toBe('ru');
  });
});
