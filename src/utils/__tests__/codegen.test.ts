import { generateCode } from '../codegen';
import codegen from 'postman-code-generators';
import { HttpMethod, RestRequest } from '@/types';

jest.mock('postman-collection', () => ({
  Request: jest.fn(),
  RequestBody: jest.fn(),
}));

jest.mock('postman-code-generators', () => ({
  convert: jest.fn(),
}));

const mockRequest: RestRequest = {
  method: 'POST',
  url: 'https://example.com',
  headers: [{ key: 'Content-Type', value: 'application/json' }],
  body: '{"foo":"bar"}',
  bodyType: 'json',
};

test('returns generated code snippet', async () => {
  (codegen.convert as jest.Mock).mockImplementation(
    (_lang, _variant, _req, _opts, cb) => cb(null, 'mock-code')
  );

  const result = await generateCode(mockRequest, 'curl');
  expect(result).toBe('mock-code');
});

test('returns fallback on conversion error', async () => {
  (codegen.convert as jest.Mock).mockImplementation(
    (_lang, _variant, _req, _opts, cb) => cb(new Error('fail'), null)
  );

  const result = await generateCode(mockRequest, 'curl');
  expect(result).toBe('Error generating code');
});

test('returns fallback on missing data', async () => {
  const invalidRequest: RestRequest = {
    method: 'INVALID_METHOD' as HttpMethod,
    url: '',
    headers: [],
    body: '',
    bodyType: 'text',
  };

  const result = await generateCode(invalidRequest, 'curl');
  expect(result).toBe('');
});
