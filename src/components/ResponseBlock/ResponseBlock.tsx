import React from 'react';
import { ResponseDataType } from '@/types';

type Props = {
  status: number;
  data: ResponseDataType;
};

const ResponseBlock = ({ status, data }: Props) => {
  const content = data ? JSON.stringify(data, null, 2) : null;

  return (
    <div className="response-block">
      <div className="response-status">Status: {status}</div>
      {data && <pre>{content}</pre>}
    </div>
  );
};

export default ResponseBlock;
