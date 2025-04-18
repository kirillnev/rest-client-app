'use client';

import React from 'react';
import { ResponseDataType } from '@/types';
import '../RestClient/rest-client.css';

type Props = {
  status: number;
  data: ResponseDataType;
};

const ResponseBlock = ({ status, data }: Props) => {
  const content = data ? JSON.stringify(data, null, 2) : null;

  return (
    <div className="response-block">
      <h3 className="generated-code-title">Response</h3>
      <textarea
        className="response-textarea"
        rows={12}
        value={`Status: ${status}\n\n${content ?? ''}`}
        readOnly
      />
    </div>
  );
};

export default ResponseBlock;
