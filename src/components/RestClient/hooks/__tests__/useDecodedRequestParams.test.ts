import { renderHook } from '@testing-library/react';
import { useDecodedRequestParams } from '../useDecodedRequestParams';
import { parseRestRequest } from '@/utils/requestUtils';

jest.mock('next/navigation', () => ({
  useParams: () => ({ params: ['POST', 'aHR0cHM6Ly9mb28uYmFy', 'Ym9keQ=='] }),
  useSearchParams: () => new URLSearchParams('Content-Type=application%2Fjson'),
}));

jest.mock('@/utils/requestUtils', () => ({
  parseRestRequest: jest.fn(),
}));

test('returns parsed request from route params and search params', () => {
  const mockRequest = {
    method: 'POST',
    url: 'https://foo.bar',
    body: 'body',
    bodyType: 'text',
    headers: [{ key: 'Content-Type', value: 'application/json' }],
  };

  (parseRestRequest as jest.Mock).mockReturnValue(mockRequest);

  const { result } = renderHook(() => useDecodedRequestParams());

  expect(parseRestRequest).toHaveBeenCalledWith(
    ['POST', 'aHR0cHM6Ly9mb28uYmFy', 'Ym9keQ=='],
    new URLSearchParams('Content-Type=application%2Fjson')
  );
  expect(result.current).toEqual(mockRequest);
});
