import { prettifyJson } from '../prettifyJson';

describe('prettifyJson', () => {
  test('returns prettified JSON string for valid input', () => {
    const input = '{"key":"value"}';
    const result = prettifyJson(input);
    expect(result).toBe('{\n  "key": "value"\n}');
  });

  test('returns null for invalid JSON input', () => {
    const input = '{"key":}';
    const result = prettifyJson(input);
    expect(result).toBeNull();
  });
});
