'use client';

import GeneratedCode from '@/components/GeneratedCode';
import ResponseBlock from '@/components/ResponseBlock';
import RequestForm from '@/components/RequestForm';
import { useRestClient } from './hooks/useRestClient';
import { useTranslation } from 'react-i18next';

const RestClient = () => {
  const { t } = useTranslation();
  const { form, isLoading, error, responseStatus, responseData, onSubmit } =
    useRestClient();

  return (
    <div className="rest-client">
      <RequestForm form={form} isLoading={isLoading} onSubmit={onSubmit} />
      <GeneratedCode request={form.watch()} />
      {error ? (
        <div className="error">
          {t('response.error')}: {error}
        </div>
      ) : responseStatus ? (
        <ResponseBlock status={responseStatus} data={responseData} />
      ) : null}
    </div>
  );
};

export default RestClient;
