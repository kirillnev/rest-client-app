import { renderHook } from '@testing-library/react';
import { useFormInitializer } from '../useFormInitializer';
import { RestRequest } from '@/types';
import { Resolver } from 'react-hook-form';
import { RestRequestSchemaType } from '@/components/RestClient/restRequestSchema';

const mockRequest: RestRequest = {
  method: 'POST',
  url: 'https://example.com',
  body: 'body content',
  bodyType: 'text',
  headers: [{ key: 'Content-Type', value: 'application/json' }],
};

const mockResolver: Resolver<RestRequestSchemaType> = async () => ({
  values: {},
  errors: {},
});

test('initializes form with request data', () => {
  const { result } = renderHook(() =>
    useFormInitializer({ request: mockRequest, resolver: mockResolver })
  );

  expect(result.current.getValues()).toMatchObject({
    method: 'POST',
    url: 'https://example.com',
    body: 'body content',
    headers: [{ key: 'Content-Type', value: 'application/json' }],
  });
});

test('does nothing if request is null', () => {
  const { result } = renderHook(() =>
    useFormInitializer({ request: null, resolver: mockResolver })
  );

  expect(result.current.getValues()).toMatchObject({
    method: 'GET',
    url: '',
    body: '',
    bodyType: 'text',
    headers: [],
  });
});
