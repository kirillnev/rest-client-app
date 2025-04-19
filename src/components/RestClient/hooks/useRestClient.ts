import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResponseDataType } from '@/types';
import { getRestRequestSchema } from '@/components/RestClient/restRequestSchema';
import { useFormInitializer } from '@/components/RestClient/hooks/useFormInitializer';
import { useDecodedRequestParams } from '@/components/RestClient/hooks/useDecodedRequestParams';
import { useGetResponse } from '@/components/RestClient/hooks/useGetResponse';
import { useSubmitRequest } from '@/components/RestClient/hooks/useSubmitRequest';
import { useTranslation } from 'react-i18next';

export const useRestClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<ResponseDataType>(null);
  const { t } = useTranslation();

  const request = useDecodedRequestParams();
  const form = useFormInitializer({
    request,
    resolver: zodResolver(getRestRequestSchema(t)),
  });

  useGetResponse({
    request,
    setIsLoading,
    setError,
    setResponseData,
    setResponseStatus,
  });

  const onSubmit = useSubmitRequest();

  return {
    form,
    isLoading,
    error,
    responseStatus,
    responseData,
    onSubmit,
  };
};
