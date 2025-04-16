import { renderHook } from '@testing-library/react';
import { useRequestInitializer } from '../useRequestInitializer';
import { decodeBase64 } from '@/utils/base64';
import { useParams, useSearchParams } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import { RestRequestSchemaType } from '../../types';

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('@/utils/base64', () => ({
  decodeBase64: jest.fn((s: string) => `decoded:${s}`),
}));

const setValue = jest.fn();
const getForm = (): UseFormReturn<RestRequestSchemaType> =>
  ({
    setValue,
  }) as unknown as UseFormReturn<RestRequestSchemaType>;

afterEach(() => {
  jest.clearAllMocks();
});

test('skips if no params', () => {
  (useParams as jest.Mock).mockReturnValue({});
  (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

  renderHook(() => useRequestInitializer(getForm()));
  expect(setValue).not.toHaveBeenCalled();
});

test('sets values correctly', () => {
  (useParams as jest.Mock).mockReturnValue({
    params: ['POST', 'aHR0cDovL2V4YW1wbGU=', 'Ym9keQ=='],
  });
  (useSearchParams as jest.Mock).mockReturnValue(
    new URLSearchParams({
      key1: 'value1',
      key2: 'value2',
    })
  );

  renderHook(() => useRequestInitializer(getForm()));

  expect(setValue).toHaveBeenCalledWith('method', 'POST');
  expect(setValue).toHaveBeenCalledWith('url', 'decoded:aHR0cDovL2V4YW1wbGU=');
  expect(setValue).toHaveBeenCalledWith('body', 'decoded:Ym9keQ==');
  expect(setValue).toHaveBeenCalledWith('headers', [
    { key: 'key1', value: 'value1' },
    { key: 'key2', value: 'value2' },
  ]);
});

test('handles decode error', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  (decodeBase64 as jest.Mock).mockImplementation(() => {
    throw new Error('broken');
  });

  (useParams as jest.Mock).mockReturnValue({
    params: ['GET', 'broken=='],
  });
  (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

  renderHook(() => useRequestInitializer(getForm()));
  expect(console.error).toHaveBeenCalled();
});
