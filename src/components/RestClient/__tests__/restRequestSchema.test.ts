import { getRestRequestSchema } from '../restRequestSchema';
import type { TFunction } from 'i18next';

const t: TFunction = ((key: string) => key) as TFunction;

const schema = getRestRequestSchema(t);

test('valid request passes validation', () => {
  const result = schema.safeParse({
    method: 'POST',
    url: 'https://example.com',
    headers: [{ key: 'Content-Type', value: 'application/json' }],
    bodyType: 'json',
    body: '{"foo":"bar"}',
  });
  expect(result.success).toBe(true);
});

test('invalid url fails', () => {
  const result = schema.safeParse({
    method: 'GET',
    url: 'invalid-url',
    headers: [],
    bodyType: 'text',
    body: '',
  });
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.format().url?._errors[0]).toBe('validation.url');
  }
});

test('invalid header key fails', () => {
  const result = schema.safeParse({
    method: 'GET',
    url: 'https://example.com',
    headers: [{ key: 'Invalid Key!', value: '123' }],
    bodyType: 'text',
    body: '',
  });
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.format().headers?.[0]?.key?._errors[0]).toBe(
      'validation.headerKey'
    );
  }
});

test('invalid json body fails', () => {
  const result = schema.safeParse({
    method: 'POST',
    url: 'https://example.com',
    headers: [],
    bodyType: 'json',
    body: '{invalid}',
  });
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.format().body?._errors[0]).toBe(
      'validation.invalidJson'
    );
  }
});

test('body not allowed for GET fails', () => {
  const result = schema.safeParse({
    method: 'GET',
    url: 'https://example.com',
    headers: [],
    bodyType: 'text',
    body: 'not empty',
  });
  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.format().body?._errors[0]).toBe(
      'validation.bodyNotAllowed'
    );
  }
});
