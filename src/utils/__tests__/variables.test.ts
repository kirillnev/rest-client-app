import { replaceVariables } from '../variables';
import { RestRequest, Variable } from '@/types';

const request: RestRequest = {
  method: 'POST',
  url: 'https://api.com/{{endpoint}}',
  body: '{"id":"{{userId}}"}',
  bodyType: 'json',
  headers: [
    { key: 'Authorization', value: 'Bearer {{token}}' },
    { key: 'Content-Type', value: 'application/json' },
  ],
};

const variables: Variable[] = [
  { key: 'endpoint', value: 'users' },
  { key: 'userId', value: '123' },
  { key: 'token', value: 'abc123' },
];

test('replaces all variables in url, body and headers', () => {
  const result = replaceVariables(request, variables);

  expect(result.url).toBe('https://api.com/users');
  expect(result.body).toBe('{"id":"123"}');
  expect(result.headers).toEqual([
    { key: 'Authorization', value: 'Bearer abc123' },
    { key: 'Content-Type', value: 'application/json' },
  ]);
});

test('returns original request if no variables', () => {
  const result = replaceVariables(request, []);
  expect(result).toEqual({
    ...request,
    headers: [
      { key: 'Authorization', value: 'Bearer {{token}}' },
      { key: 'Content-Type', value: 'application/json' },
    ],
  });
});

test('uses empty array if variables not provided', () => {
  const result = replaceVariables(request);

  expect(result).toEqual({
    ...request,
    headers: [
      { key: 'Authorization', value: 'Bearer {{token}}' },
      { key: 'Content-Type', value: 'application/json' },
    ],
  });
});
