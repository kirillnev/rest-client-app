import { renderHook, act } from '@testing-library/react';
import { useGetResponse } from '../useGetResponse';
import { sendRequestRaw } from '@/utils/requestUtils';
import { RestRequest } from '@/types';

jest.mock('@/utils/requestUtils', () => ({
  sendRequestRaw: jest.fn(),
}));

const mockRequest: RestRequest = {
  method: 'GET',
  url: 'https://example.com',
  body: '',
  bodyType: 'text',
  headers: [],
};

beforeEach(() => {
  jest.clearAllMocks();
});

test('calls request and updates state on success', async () => {
  (sendRequestRaw as jest.Mock).mockResolvedValue({
    status: 200,
    body: { success: true },
  });

  const setIsLoading = jest.fn();
  const setError = jest.fn();
  const setResponseData = jest.fn();
  const setResponseStatus = jest.fn();

  await act(async () => {
    renderHook(() =>
      useGetResponse({
        request: mockRequest,
        setIsLoading,
        setError,
        setResponseData,
        setResponseStatus,
      })
    );
  });

  expect(setIsLoading).toHaveBeenCalledWith(true);
  expect(setError).toHaveBeenCalledWith(null);
  expect(setResponseData).toHaveBeenCalledWith(null);
  expect(setResponseStatus).toHaveBeenCalledWith(null);
  expect(sendRequestRaw).toHaveBeenCalledWith(mockRequest);
  expect(setResponseStatus).toHaveBeenCalledWith(200);
  expect(setResponseData).toHaveBeenCalledWith({ success: true });
  expect(setIsLoading).toHaveBeenLastCalledWith(false);
});

test('sets error on request failure', async () => {
  (sendRequestRaw as jest.Mock).mockRejectedValue(new Error('fail'));

  const setIsLoading = jest.fn();
  const setError = jest.fn();
  const setResponseData = jest.fn();
  const setResponseStatus = jest.fn();

  await act(async () => {
    renderHook(() =>
      useGetResponse({
        request: mockRequest,
        setIsLoading,
        setError,
        setResponseData,
        setResponseStatus,
      })
    );
  });

  expect(setError).toHaveBeenCalledWith('fail');
  expect(setIsLoading).toHaveBeenLastCalledWith(false);
});

test('does nothing if request is null', async () => {
  const setIsLoading = jest.fn();
  const setError = jest.fn();
  const setResponseData = jest.fn();
  const setResponseStatus = jest.fn();

  await act(async () => {
    renderHook(() =>
      useGetResponse({
        request: null,
        setIsLoading,
        setError,
        setResponseData,
        setResponseStatus,
      })
    );
  });

  expect(setIsLoading).not.toHaveBeenCalled();
  expect(setError).not.toHaveBeenCalled();
  expect(setResponseData).not.toHaveBeenCalled();
  expect(setResponseStatus).not.toHaveBeenCalled();
  expect(sendRequestRaw).not.toHaveBeenCalled();
});
