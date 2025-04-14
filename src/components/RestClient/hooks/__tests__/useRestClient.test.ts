import { renderHook, act } from '@testing-library/react';
import { useRestClient } from '../useRestClient';
import { sendRequestRaw } from '@/utils/requestUtils';
import { saveToHistory } from '@/utils/saveToHistory';
import { RestRequest } from '@/types';

jest.mock('@/utils/requestUtils', () => ({
  sendRequestRaw: jest.fn(),
}));

jest.mock('@/utils/saveToHistory', () => ({
  saveToHistory: jest.fn(),
}));

const mockData: RestRequest = {
  method: 'GET',
  url: 'https://example.com',
  headers: [],
  body: '',
  bodyType: 'text',
};

describe('useRestClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('successful request updates state and saves to history', async () => {
    (sendRequestRaw as jest.Mock).mockResolvedValue({
      status: 200,
      body: { success: true },
    });

    const { result } = renderHook(() => useRestClient());

    await act(async () => {
      await result.current.onSubmit(mockData);
    });

    expect(sendRequestRaw).toHaveBeenCalledWith(mockData);
    expect(result.current.responseStatus).toBe(200);
    expect(result.current.responseData).toEqual({ success: true });
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(saveToHistory).toHaveBeenCalledWith(mockData);
  });

  test('network error does not call saveToHistory', async () => {
    (sendRequestRaw as jest.Mock).mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useRestClient());

    await act(async () => {
      await result.current.onSubmit(mockData);
    });

    expect(sendRequestRaw).toHaveBeenCalledWith(mockData);
    expect(result.current.error).toBe('fail');
    expect(result.current.responseStatus).toBeNull();
    expect(result.current.responseData).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(saveToHistory).not.toHaveBeenCalled();
  });
});
