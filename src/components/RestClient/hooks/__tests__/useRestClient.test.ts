import { renderHook } from '@testing-library/react';
import { useRestClient } from '../useRestClient';
import { RestRequest } from '@/types';

const mockRequest: RestRequest = {
  method: 'GET',
  url: 'https://test.com',
  headers: [],
  body: '',
  bodyType: 'text',
};

const mockForm = {
  getValues: jest.fn(),
  setValue: jest.fn(),
  watch: jest.fn(),
  handleSubmit: jest.fn(),
  reset: jest.fn(),
  formState: { errors: {} },
};

const mockOnSubmit = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@/components/RestClient/hooks/useDecodedRequestParams', () => ({
  useDecodedRequestParams: () => mockRequest,
}));

jest.mock('@/components/RestClient/hooks/useFormInitializer', () => ({
  useFormInitializer: jest.fn(() => mockForm),
}));

jest.mock('@/components/RestClient/hooks/useGetResponse', () => ({
  useGetResponse: jest.fn(),
}));

jest.mock('@/components/RestClient/hooks/useSubmitRequest', () => ({
  useSubmitRequest: () => mockOnSubmit,
}));

test('returns expected shape and calls hooks with correct params', () => {
  const { result } = renderHook(() => useRestClient());

  expect(result.current).toEqual(
    expect.objectContaining({
      form: mockForm,
      isLoading: false,
      error: null,
      responseStatus: null,
      responseData: null,
      onSubmit: mockOnSubmit,
    })
  );

  const {
    useFormInitializer,
  } = require('@/components/RestClient/hooks/useFormInitializer');
  const {
    useGetResponse,
  } = require('@/components/RestClient/hooks/useGetResponse');

  expect(useFormInitializer).toHaveBeenCalledWith(
    expect.objectContaining({ request: mockRequest })
  );

  expect(useGetResponse).toHaveBeenCalledWith(
    expect.objectContaining({
      request: mockRequest,
      setIsLoading: expect.any(Function),
      setError: expect.any(Function),
      setResponseData: expect.any(Function),
      setResponseStatus: expect.any(Function),
    })
  );
});
