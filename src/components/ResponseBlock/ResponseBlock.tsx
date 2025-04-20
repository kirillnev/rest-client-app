'use client';

import React from 'react';
import { ResponseDataType } from '@/types';
import { useTranslation } from 'react-i18next';
import '../RestClient/rest-client.css';

type Props = {
  status: number;
  data: ResponseDataType;
};

const ResponseBlock = ({ status, data }: Props) => {
  const { t } = useTranslation();
  const content = data ? JSON.stringify(data, null, 2) : null;

  return (
    <div className="response-block">
      <h3 className="generated-code-title">{t('response.title')}</h3>
      <textarea
        className="response-textarea"
        rows={12}
        value={`${t('response.status')}: ${status}\n\n${content ?? ''}`}
        readOnly
      />
    </div>
  );
};

export default ResponseBlock;
