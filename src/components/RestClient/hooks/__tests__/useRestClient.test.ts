import { renderHook, act } from '@testing-library/react';
import { useRestClient } from '../useRestClient';
import { useRequestInitializer } from '@/components/RestClient/hooks/useRequestInitializer';
import { useSubmitRequest } from '@/components/RestClient/hooks/useSubmitRequest';
import { RestRequest } from '@/types';

jest.mock('react-hook-form', () => {
  const actual = jest.requireActual('react-hook-form');
  return {
    ...actual,
    useForm: jest.fn(() => ({
      setValue: jest.fn(),
      getValues: jest.fn(),
      watch: jest.fn(),
      reset: jest.fn(),
      trigger: jest.fn(),
      clearErrors: jest.fn(),
      setError: jest.fn(),
      handleSubmit: jest.fn(),
      formState: {},
    })),
  };
});

jest.mock('@/components/RestClient/hooks/useRequestInitializer', () => ({
  useRequestInitializer: jest.fn(),
}));

jest.mock('@/components/RestClient/hooks/useSubmitRequest', () => ({
  useSubmitRequest: jest.fn(),
}));

const mockSubmit = jest.fn();

beforeEach(() => {
  (useRequestInitializer as jest.Mock).mockImplementation(() => {});
  (useSubmitRequest as jest.Mock).mockReturnValue(mockSubmit);
  jest.clearAllMocks();
});

test('initializes and returns expected values', async () => {
  const { result } = renderHook(() => useRestClient());

  expect(result.current.isLoading).toBe(false);
  expect(result.current.error).toBe(null);
  expect(result.current.responseStatus).toBe(null);
  expect(result.current.responseData).toBe(null);
  expect(result.current.onSubmit).toBe(mockSubmit);
  expect(useRequestInitializer).toHaveBeenCalled();
  expect(useSubmitRequest).toHaveBeenCalled();
});

test('submit updates state', async () => {
  const { result } = renderHook(() => useRestClient());
  await act(async () => {
    await result.current.onSubmit({} as RestRequest);
  });

  expect(mockSubmit).toHaveBeenCalled();
});
