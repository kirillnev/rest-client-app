import { useFieldArray } from 'react-hook-form';
import { RestRequest } from '@/types';
import { prettifyJson } from '@/utils/prettifyJson';
import { UseFormReturn } from 'react-hook-form';

export const useRequestForm = (form: UseFormReturn<RestRequest>) => {
  const { control, watch, getValues, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'headers',
  });

  const watchedBodyType = watch('bodyType');

  const handlePrettify = () => {
    const pretty = prettifyJson(getValues('body'));
    if (pretty) setValue('body', pretty);
  };

  return {
    fields,
    append,
    remove,
    watchedBodyType,
    handlePrettify,
  };
};
