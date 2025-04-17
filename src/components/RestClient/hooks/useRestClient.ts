import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { ResponseDataType } from '@/types';
import { RestRequestSchemaType } from '../types';
import { restRequestSchema } from '../restRequestSchema';
import { useRequestInitializer } from '@/components/RestClient/hooks/useRequestInitializer';
import { useSubmitRequest } from '@/components/RestClient/hooks/useSubmitRequest';

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

  useRequestInitializer(form);

  const onSubmit = useSubmitRequest({
    setIsLoading,
    setError,
    setResponseData,
    setResponseStatus,
  });

  return { form, isLoading, error, responseStatus, responseData, onSubmit };
};
