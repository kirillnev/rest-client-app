import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResponseDataType, RestRequest } from '@/types';
import { RestRequestSchemaType } from '../types';
import { restRequestSchema } from '../restRequestSchema';
import { useState } from 'react';
import { sendRequestRaw } from '@/utils/requestUtils';
import { saveToHistory } from '@/utils/localStorageUtils';

export const useRestClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<ResponseDataType>(null);

  const form = useForm<RestRequestSchemaType>({
    resolver: zodResolver(restRequestSchema),
    mode: 'onBlur',
    defaultValues: {
      method: 'GET',
      url: '',
      body: '',
      bodyType: 'text',
      headers: [],
    },
  });

  const onSubmit = async (data: RestRequest) => {
    setIsLoading(true);
    setError(null);
    setResponseStatus(null);
    setResponseData(null);

    try {
      const { status, body } = await sendRequestRaw(data);
      setResponseStatus(status);
      setResponseData(body);
      saveToHistory({ ...data, createdAt: Date.now() });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    error,
    responseStatus,
    responseData,
    onSubmit,
  };
};
