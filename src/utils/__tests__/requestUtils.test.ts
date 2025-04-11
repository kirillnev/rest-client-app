import { buildApiProxyUrl } from '../requestUtils';
import { RestRequest } from '@/types';

jest.mock('../base64', () => ({
  encodeBase64: (str: string) => `base64(${str})`,
}));

describe('buildApiProxyUrl', () => {
  test('builds URL with JSON body and headers', () => {
    const data: RestRequest = {
      method: 'POST',
      url: 'https://example.com',
      body: '{"key":"value"}',
      bodyType: 'json',
      headers: [
        { key: 'Authorization', value: 'Bearer token' },
        { key: 'Content-Type', value: 'application/json' },
      ],
    };

    const result = buildApiProxyUrl(data);

    expect(result).toBe(
      '/api/proxy/POST/base64(https://example.com)/base64({"key":"value"})?Authorization=Bearer%2520token&Content-Type=application%252Fjson'
    );
  });

  test('builds URL with text body and no headers', () => {
    const data: RestRequest = {
      method: 'GET',
      url: 'https://api.com',
      body: 'hello',
      bodyType: 'text',
      headers: [],
    };

    const result = buildApiProxyUrl(data);

    expect(result).toBe('/api/proxy/GET/base64(https://api.com)/base64(hello)');
  });
});
