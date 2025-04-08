describe('Supabase client initialization', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should create supabase client when env vars are set', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'some-anon-key';

    const { supabase } = await import('@/lib/supabase');
    expect(supabase).toBeDefined();
  });

  it('should throw error if env vars are missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    await expect(import('@/lib/supabase')).rejects.toThrow(
      'Missing Supabase environment variables'
    );
  });
});
