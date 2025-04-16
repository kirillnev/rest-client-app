import { useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { decodeBase64 } from '@/utils/base64';
import { RestRequest, HttpMethod } from '@/types';
import { UseFormReturn } from 'react-hook-form';
import { RestRequestSchemaType } from '../types';

export const useRequestInitializer = (
  form: UseFormReturn<RestRequestSchemaType>
) => {
  const rawParams = useParams() as { params?: string[] };
  const searchParams = useSearchParams();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const { params } = rawParams;
    if (!params || params.length < 2) return;

    const [method, encodedUrl, encodedBody] = params;
    try {
      form.setValue('method', method as HttpMethod);
      form.setValue('url', decodeBase64(encodedUrl));

      if (encodedBody) form.setValue('body', decodeBase64(encodedBody));

      const headers: RestRequest['headers'] = [];

      searchParams.forEach((value, key) => {
        headers.push({ key, value });
      });

      form.setValue('headers', headers);
    } catch (e) {
      console.error('Failed to decode URL params', e);
    }
  }, [form, rawParams, searchParams]);
};
