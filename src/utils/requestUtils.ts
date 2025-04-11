import { RestRequest, ResponseDataType } from '@/types';
import { encodeBase64 } from './base64';

export const buildApiProxyUrl = (data: RestRequest): string => {
  const { method, url, body, bodyType, headers } = data;
  const bodyStr = bodyType === 'json' ? JSON.stringify(JSON.parse(body)) : body;
  const base64Url = encodeBase64(url);
  const base64Body = encodeBase64(bodyStr);
  const methodUpper = method.toUpperCase();

  const query = new URLSearchParams();
  headers.forEach(({ key, value }) => {
    if (key) query.append(key, encodeURIComponent(value));
  });

  return `/api/proxy/${methodUpper}/${base64Url}/${base64Body}${query.toString() ? `?${query.toString()}` : ''}`;
};

export const sendRequestRaw = async (
  data: RestRequest
): Promise<{ status: number; body: ResponseDataType }> => {
  const url = buildApiProxyUrl(data);
  const res = await fetch(url, { method: 'GET' });

  const contentType = res.headers.get('content-type') || '';
  const parsed: ResponseDataType = contentType.includes('application/json')
    ? await res.json()
    : await res.text();

  return { status: res.status, body: parsed };
};
