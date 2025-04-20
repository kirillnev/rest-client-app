import { encodeBase64, decodeBase64 } from '../base64';

describe('encodeBase64', () => {
  test('encodes a simple string in browser environment', () => {
    const result = encodeBase64('test');
    expect(result).toBe('dGVzdA');
  });

  test('encodes empty string', () => {
    const result = encodeBase64('');
    expect(result).toBe('');
  });
});

describe('decodeBase64', () => {
  test('decodes a simple base64 string in browser environment', () => {
    const result = decodeBase64('dGVzdA');
    expect(result).toBe('test');
  });

  test('decodes empty string', () => {
    const result = decodeBase64('');
    expect(result).toBe('');
  });
});
