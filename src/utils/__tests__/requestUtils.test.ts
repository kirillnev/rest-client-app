import {
  buildRestUrl,
  normalizeHeaders,
  parseResponse,
  parseRestRequest,
  sendRequest,
  sendRequestRaw,
} from '../requestUtils';
import { RestRequest } from '@/types';

jest.mock('../base64', () => ({
  encodeBase64: (str: string) => `base64(${str})`,
  decodeBase64: jest.fn((str: string) => str),
}));

describe('normalizeHeaders', () => {
  test('converts array to record', () => {
    const headers = [
      { key: 'Authorization', value: 'Bearer token' },
      { key: 'Content-Type', value: 'application/json' },
    ];

    expect(normalizeHeaders(headers)).toEqual({
      Authorization: 'Bearer token',
      'Content-Type': 'application/json',
    });
  });
});

describe('parseResponse', () => {
  test('parses json if content-type is application/json', async () => {
    const mockRes = {
      headers: { get: () => 'application/json' },
      text: async () => JSON.stringify({ test: 1 }),
    };

    const result = await parseResponse(mockRes as unknown as Response);
    expect(result).toEqual({ test: 1 });
  });

  test('returns text if not json', async () => {
    const mockRes = {
      headers: { get: () => 'text/plain' },
      text: async () => 'plain text',
    };

    const result = await parseResponse(mockRes as unknown as Response);
    expect(result).toBe('plain text');
  });
});

describe('parseRestRequest', () => {
  test('returns null if params are missing', () => {
    expect(parseRestRequest(undefined, new URLSearchParams())).toBeNull();
  });

  test('parses method, url, body, and headers', () => {
    const params = ['POST', 'url', 'body'];
    const searchParams = new URLSearchParams();
    searchParams.append('Authorization', encodeURIComponent('Bearer token'));

    const result = parseRestRequest(params, searchParams);

    expect(result).toEqual({
      method: 'POST',
      url: 'url',
      body: 'body',
      bodyType: 'text',
      headers: [{ key: 'Authorization', value: 'Bearer token' }],
    });
  });

  test('returns null on decode error', () => {
    const decodeBase64 = jest.requireMock('../base64')
      .decodeBase64 as jest.Mock;
    decodeBase64.mockImplementationOnce(() => {
      throw new Error('bad base64');
    });

    const params = ['GET', 'bad'];
    const searchParams = new URLSearchParams();
    expect(parseRestRequest(params, searchParams)).toBeNull();
  });
});

describe('buildRestUrl', () => {
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

    const result = buildRestUrl(data);

    expect(result).toBe(
      '/POST/base64(https://example.com)/base64({"key":"value"})?Authorization=Bearer%2520token&Content-Type=application%252Fjson'
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

    const result = buildRestUrl(data, '/api/proxy');

    expect(result).toBe('/api/proxy/GET/base64(https://api.com)/base64(hello)');
  });
});

describe('sendRequestRaw', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({ foo: 'bar' }),
    } as unknown as Response);
  });

  test('fetches and returns parsed json response', async () => {
    const data: RestRequest = {
      method: 'GET',
      url: 'https://example.com',
      body: '{"foo":"bar"}',
      bodyType: 'json',
      headers: [],
    };

    const res = await sendRequestRaw(data);
    expect(res).toEqual({ status: 200, body: { foo: 'bar' } });
  });
});

describe('sendRequest', () => {
  test('returns parsed response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 201,
      statusText: 'Created',
      headers: {
        get: () => 'text/plain',
        entries: () => [['content-type', 'text/plain']],
      },
      text: async () => 'ok',
    } as unknown as Response);

    const res = await sendRequest({
      method: 'POST',
      url: 'https://example.com',
      body: 'data',
      bodyType: 'text',
      headers: [{ key: 'Content-Type', value: 'text/plain' }],
    });

    expect(res.status).toBe(201);
    expect(res.body).toBe('ok');
    expect(res.statusText).toBe('Created');
    expect(res.headers).toEqual({ 'content-type': 'text/plain' });
  });

  test('throws on fetch error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network error'));

    const request: RestRequest = {
      method: 'GET',
      url: 'https://fail.test',
      body: '',
      bodyType: 'text',
      headers: [],
    };

    await expect(sendRequest(request)).rejects.toThrow('fetch failed');
  });
});
