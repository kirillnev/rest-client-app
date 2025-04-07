import { useForm } from 'react-hook-form';
import { RestRequest } from '@/types';
import { useSendRequest } from './useSendRequest';

export const useRestClient = () => {
  const form = useForm<RestRequest>({
    defaultValues: {
      method: 'GET',
      url: '',
      body: '',
      bodyType: 'text',
      headers: [{ key: '', value: '' }],
    },
  });

  const { handleSubmit, watch } = form;
  const { isLoading, error, responseStatus, responseData, sendRequest } =
    useSendRequest();

  const onSubmit = (data: RestRequest) => {
    sendRequest(data);
  };

  return {
    form,
    isLoading,
    error,
    responseStatus,
    responseData,
    watchedRequest: watch(),
    handleFormSubmit: handleSubmit(onSubmit),
  };
};
