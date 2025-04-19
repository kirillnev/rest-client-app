'use client';

import { UseFormReturn } from 'react-hook-form';
import { RestRequest } from '@/types';
import { useRequestForm } from './hooks/useRequestForm';
import MethodUrlBlock from './MethodUrlBlock';
import HeadersBlock from './HeadersBlock';
import BodyBlock from './BodyBlock';
import { useTranslation } from 'react-i18next';
import '../RestClient/rest-client.css';

type Props = {
  form: UseFormReturn<RestRequest>;
  onSubmit: (data: RestRequest) => Promise<void>;
  isLoading: boolean;
};

const RequestForm = ({ form, onSubmit, isLoading }: Props) => {
  const { t } = useTranslation();
  const { register, formState, handleSubmit } = form;
  const { fields, append, remove, watchedBodyType, handlePrettify } =
    useRequestForm(form);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rest-client-form">
      <h2>{t('request.form.title')}</h2>
      <fieldset disabled={isLoading}>
        <MethodUrlBlock register={register} errors={formState.errors} />
        <HeadersBlock
          register={register}
          errors={formState.errors}
          fields={fields}
          append={append}
          remove={remove}
        />
        <BodyBlock
          register={register}
          errors={formState.errors}
          watchedBodyType={watchedBodyType}
          handlePrettify={handlePrettify}
        />
        <button type="submit">
          {isLoading ? t('request.form.sending') : t('request.form.send')}
        </button>
      </fieldset>
    </form>
  );
};

export default RequestForm;
