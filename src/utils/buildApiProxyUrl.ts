import { RestRequest } from '@/types';
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
