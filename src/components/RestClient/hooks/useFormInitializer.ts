import { useEffect, useRef } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { HttpMethod } from '@/types';
import { RestRequest } from '@/types';
import { Resolver } from 'react-hook-form';
import { RestRequestSchemaType } from '@/components/RestClient/restRequestSchema';

type Props = {
  request: RestRequest | null;
  resolver: Resolver<RestRequestSchemaType>;
};

export const useFormInitializer = ({
  request,
  resolver,
}: Props): UseFormReturn<RestRequestSchemaType> => {
  const isInitialized = useRef(false);

  const form = useForm<RestRequestSchemaType>({
    resolver: resolver,
    mode: 'onBlur',
    defaultValues: {
      method: 'GET',
      url: '',
      body: '',
      bodyType: 'text',
      headers: [],
    },
  });

  useEffect(() => {
    if (!request || isInitialized.current) return;
    isInitialized.current = true;

    form.setValue('method', request.method as HttpMethod);
    form.setValue('url', request.url);
    form.setValue('body', request.body);
    form.setValue('headers', request.headers);
  }, [form, request]);

  return form;
};
