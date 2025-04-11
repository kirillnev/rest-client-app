import { renderHook, act } from '@testing-library/react';
import { useSendRequest } from '../useSendRequest';
import { sendRequestRaw } from '@/utils/requestUtils';
import { RestRequest } from '@/types';

jest.mock('@/utils/requestUtils', () => ({
  sendRequestRaw: jest.fn(),
}));

const mockData: RestRequest = {
  method: 'GET',
  url: 'https://example.com',
  headers: [],
  body: '',
  bodyType: 'text',
};

test('successful request sets status and data', async () => {
  (sendRequestRaw as jest.Mock).mockResolvedValue({
    status: 200,
    body: { message: 'ok' },
  });

  const { result } = renderHook(() => useSendRequest());

  await act(() => result.current.sendRequest(mockData));

  expect(sendRequestRaw).toHaveBeenCalledWith(mockData);
  expect(result.current.isLoading).toBe(false);
  expect(result.current.responseStatus).toBe(200);
  expect(result.current.responseData).toEqual({ message: 'ok' });
  expect(result.current.error).toBeNull();
});

test('failed request sets error', async () => {
  (sendRequestRaw as jest.Mock).mockRejectedValue(new Error('Request failed'));

  const { result } = renderHook(() => useSendRequest());

  await act(() => result.current.sendRequest(mockData));

  expect(sendRequestRaw).toHaveBeenCalledWith(mockData);
  expect(result.current.isLoading).toBe(false);
  expect(result.current.error).toBe('Request failed');
  expect(result.current.responseStatus).toBeNull();
  expect(result.current.responseData).toBeNull();
});
