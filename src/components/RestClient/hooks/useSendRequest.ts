import { useState } from 'react';
import { RestRequest, ResponseDataType } from '@/types';
import { sendRequestRaw } from '@/utils/requestUtils';

export const useSendRequest = () => {
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
      const { status, body } = await sendRequestRaw(data);
      setResponseStatus(status);
      setResponseData(body);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, responseStatus, responseData, sendRequest };
};
