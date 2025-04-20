import { renderHook, act } from '@testing-library/react';
import { useSubmitRequest } from '../useSubmitRequest';
import { RestRequest } from '@/types';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
  }),
}));

jest.mock('@/utils/requestUtils', () => ({
  buildRestUrl: jest.fn(() => '/mock-url'),
}));

jest.mock('@/utils/localStorageUtils', () => ({
  saveToHistory: jest.fn(),
}));

jest.mock('@/utils/variables', () => ({
  replaceVariables: jest.fn((data) => data),
}));

jest.mock('@/components/RestClient/hooks/useVariables', () => ({
  useVariables: () => [{ key: 'key', value: 'value' }],
}));

const mockData: RestRequest = {
  method: 'POST',
  url: 'https://example.com',
  headers: [],
  body: '{"key":"value"}',
  bodyType: 'json',
};

test('saves to history and redirects', () => {
  const { result } = renderHook(() => useSubmitRequest());

  act(() => {
    result.current(mockData);
  });

  const { saveToHistory } = require('@/utils/localStorageUtils');
  const { buildRestUrl } = require('@/utils/requestUtils');
  const { replaceVariables } = require('@/utils/variables');

  expect(replaceVariables).toHaveBeenCalledWith(mockData, [
    { key: 'key', value: 'value' },
  ]);

  expect(saveToHistory).toHaveBeenCalledWith(
    expect.objectContaining({
      ...mockData,
      createdAt: expect.any(Number),
    })
  );

  expect(buildRestUrl).toHaveBeenCalledWith(mockData, '/client');
  expect(push).toHaveBeenCalledWith('/mock-url');
});
