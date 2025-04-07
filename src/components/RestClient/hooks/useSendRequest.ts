import { useState } from 'react';
import { ResponseDataType, RestRequest } from '@/types';

type UseSendRequestReturn = {
  isLoading: boolean;
  error: string | null;
  responseStatus: number | null;
  responseData: ResponseDataType;
  sendRequest: (data: RestRequest) => Promise<void>;
};

export const useSendRequest = (): UseSendRequestReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<ResponseDataType>(null);

  const sendRequest = async (data: RestRequest) => {
    setIsLoading(true);
    setError(null);
    setResponseStatus(null);
    setResponseData(null);

    try {
      const parsedBody =
        data.bodyType === 'json' ? JSON.parse(data.body) : data.body;

      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          body: parsedBody,
        }),
      });

      setResponseStatus(res.status);

      const contentType = res.headers.get('content-type') || '';
      const parsed: ResponseDataType = contentType.includes('application/json')
        ? await res.json()
        : await res.text();

      setResponseData(parsed);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, responseStatus, responseData, sendRequest };
};
