import { renderHook, act } from '@testing-library/react';
import { useSubmitRequest } from '../useSubmitRequest';
import { useRouter } from 'next/navigation';
import { buildRestUrl, sendRequestRaw } from '@/utils/requestUtils';
import { saveToHistory } from '@/utils/localStorageUtils';
import { RestRequest } from '@/types';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/utils/requestUtils', () => ({
  buildRestUrl: jest.fn(),
  sendRequestRaw: jest.fn(),
}));

jest.mock('@/utils/localStorageUtils', () => ({
  saveToHistory: jest.fn(),
}));

const mockRouterPush = jest.fn();
const mockSetIsLoading = jest.fn();
const mockSetError = jest.fn();
const mockSetResponseData = jest.fn();
const mockSetResponseStatus = jest.fn();

const props = {
  setIsLoading: mockSetIsLoading,
  setError: mockSetError,
  setResponseData: mockSetResponseData,
  setResponseStatus: mockSetResponseStatus,
};

const mockData: RestRequest = {
  method: 'GET',
  url: 'https://example.com',
  headers: [],
  body: '',
  bodyType: 'json',
};

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
  jest.clearAllMocks();
});

test('successful request', async () => {
  const response = { status: 200, body: { ok: true } };
  (buildRestUrl as jest.Mock).mockReturnValue('/url');
  (sendRequestRaw as jest.Mock).mockResolvedValue(response);

  const { result } = renderHook(() => useSubmitRequest(props));

  await act(async () => {
    await result.current(mockData);
  });

  expect(mockSetIsLoading).toHaveBeenCalledWith(true);
  expect(mockSetError).toHaveBeenCalledWith(null);
  expect(mockSetResponseData).toHaveBeenCalledWith(null);
  expect(mockSetResponseStatus).toHaveBeenCalledWith(null);
  expect(mockRouterPush).toHaveBeenCalledWith('/url');
  expect(sendRequestRaw).toHaveBeenCalledWith(mockData);
  expect(mockSetResponseStatus).toHaveBeenCalledWith(200);
  expect(mockSetResponseData).toHaveBeenCalledWith({ ok: true });
  expect(saveToHistory).toHaveBeenCalledWith(expect.objectContaining(mockData));
  expect(mockSetIsLoading).toHaveBeenLastCalledWith(false);
});

test('handles request error', async () => {
  const error = new Error('fail');
  (buildRestUrl as jest.Mock).mockReturnValue('/url');
  (sendRequestRaw as jest.Mock).mockRejectedValue(error);

  const { result } = renderHook(() => useSubmitRequest(props));

  await act(async () => {
    await result.current(mockData);
  });

  expect(mockSetError).toHaveBeenCalledWith('fail');
  expect(mockSetIsLoading).toHaveBeenLastCalledWith(false);
});
