import { renderHook, act, waitFor } from '@testing-library/react';
import { useGeneratedCode } from '../useGeneratedCode';
import { generateCode } from '@/utils/codegen';
import { RestRequest } from '@/types';

jest.mock('@/utils/codegen', () => ({
  generateCode: jest.fn(),
}));

const request: RestRequest = {
  method: 'GET',
  url: 'https://example.com',
  headers: [],
  body: '',
  bodyType: 'json',
};

test('returns default language and code', async () => {
  (generateCode as jest.Mock).mockResolvedValue('generated code');
  const { result } = renderHook(() => useGeneratedCode(request));
  await waitFor(() => expect(result.current.code).toBe('generated code'));
  expect(result.current.language).toBe('curl');
});

test('changes language and updates code', async () => {
  (generateCode as jest.Mock)
    .mockResolvedValueOnce('code1')
    .mockResolvedValueOnce('code2');

  const { result } = renderHook(() => useGeneratedCode(request));
  await waitFor(() => expect(result.current.code).toBe('code1'));

  act(() => result.current.setLanguage('javascript-fetch'));
  await waitFor(() => expect(result.current.code).toBe('code2'));
  expect(result.current.language).toBe('javascript-fetch');
});
