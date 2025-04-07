'use client';

import '@/styles.css';
import GeneratedCode from '@/components/GeneratedCode';
import ResponseBlock from '@/components/ResponseBlock';
import RequestForm from '@/components/RequestForm';
import { useRestClient } from './hooks/useRestClient';

const RestClient = () => {
  const {
    form,
    isLoading,
    error,
    responseStatus,
    responseData,
    watchedRequest,
    handleFormSubmit,
  } = useRestClient();

  return (
    <div className="rest-client">
      <RequestForm
        form={form}
        isLoading={isLoading}
        onSubmit={handleFormSubmit}
      />
      <GeneratedCode request={watchedRequest} />
      {error ? (
        <div className="error">Error: {error}</div>
      ) : responseStatus ? (
        <ResponseBlock status={responseStatus} data={responseData} />
      ) : null}
    </div>
  );
};

export default RestClient;
