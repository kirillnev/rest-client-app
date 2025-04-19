import { useParams, useSearchParams } from 'next/navigation';
import { decodeBase64 } from '@/utils/base64';
import { useMemo } from 'react';
import { HttpMethod, RestRequest } from '@/types';

export const useDecodedRequestParams = (): RestRequest | null => {
  const { params } = useParams() as { params?: string[] };
  const searchParams = useSearchParams();

  return useMemo(() => {
    if (!params || params.length < 2) return null;

    const [method, encodedUrl, encodedBody] = params;

    try {
      const headers: RestRequest['headers'] = [];
      searchParams.forEach((value, key) => {
        headers.push({ key, value });
      });

      return {
        method: method as HttpMethod,
        url: decodeBase64(encodedUrl),
        body: encodedBody ? decodeBase64(encodedBody) : '',
        bodyType: 'text',
        headers,
      };
    } catch (e) {
      console.error('Failed to decode URL params', e);
      return null;
    }
  }, [params, searchParams]);
};
