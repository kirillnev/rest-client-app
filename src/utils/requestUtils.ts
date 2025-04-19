import {
  RestRequest,
  ResponseDataType,
  HttpMethod,
  RequestHeader,
} from '@/types';
import { decodeBase64, encodeBase64 } from './base64';
import { NextRequest } from 'next/server';

export const normalizeHeaders = (
  headers: RequestHeader[]
): Record<string, string> =>
  headers.reduce(
    (acc, { key, value }) => {
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );

export const parseResponse = async (
  res: Response
): Promise<ResponseDataType> => {
  const contentType = res.headers.get('content-type') || '';
  const raw = await res.text();

  return contentType.includes('application/json') ? JSON.parse(raw) : raw;
};

export const parseRequest = (req: NextRequest) => {
  const segments = req.nextUrl.pathname.split('/').slice(3);
  return parseRestRequest(segments, req.nextUrl.searchParams);
};

export const sendRequest = async (request: RestRequest) => {
  const { url, method, headers, body } = request;

  const options: RequestInit = {
    method,
    headers: normalizeHeaders(headers),
  };

  if (body) {
    options.body = body;
  }

  try {
    const res = await fetch(url, options);
    const responseBody = await parseResponse(res);

    return {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
      body: responseBody,
    };
  } catch (e) {
    console.error('sendRequest error', e);
    throw new Error('fetch failed');
  }
};

export const buildRestUrl = (data: RestRequest, prefix = ''): string => {
  const { method, url, body, bodyType, headers } = data;
  const bodyStr = bodyType === 'json' ? JSON.stringify(JSON.parse(body)) : body;
  const base64Url = encodeBase64(url);
  const base64Body = encodeBase64(bodyStr);
  const methodUpper = method.toUpperCase();

  const query = new URLSearchParams();
  headers.forEach(({ key, value }) => {
    if (key) query.append(key, encodeURIComponent(value));
  });

  return `${prefix}/${methodUpper}/${base64Url}/${base64Body}${
    query.toString() ? `?${query.toString()}` : ''
  }`;
};

export const sendRequestRaw = async (
  data: RestRequest
): Promise<{ status: number; body: ResponseDataType }> => {
  const url = buildRestUrl(data, '/api/proxy');
  const res = await fetch(url, { method: 'GET' });

  const contentType = res.headers.get('content-type') || '';
  const parsed: ResponseDataType = contentType.includes('application/json')
    ? await res.json()
    : await res.text();

  return { status: res.status, body: parsed };
};

export const parseRestRequest = (
  params: string[] | undefined,
  searchParams: URLSearchParams
): RestRequest | null => {
  if (!params || params.length < 2) return null;

  const [method, encodedUrl, encodedBody = ''] = params;

  try {
    const url = decodeBase64(encodedUrl);
    const body = decodeBase64(encodedBody);
    const headers: RestRequest['headers'] = [];

    searchParams.forEach((value, key) => {
      headers.push({ key, value: decodeURIComponent(value) });
    });

    return {
      method: method as HttpMethod,
      url,
      body,
      bodyType: 'text',
      headers,
    };
  } catch {
    return null;
  }
};
