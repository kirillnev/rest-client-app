import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RestRequest } from '@/types';
import { useSendRequest } from './useSendRequest';
import { RestRequestSchemaType } from '../types';
import { restRequestSchema } from '../restRequestSchema';

export const useRestClient = () => {
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

  const { isLoading, error, responseStatus, responseData, sendRequest } =
    useSendRequest();

  const onSubmit = async (data: RestRequest) => {
    await sendRequest(data);
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
