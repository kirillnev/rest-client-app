import React from 'react';
import { ResponseDataType } from '@/types';

type Props = {
  status: number;
  data: ResponseDataType;
};

const ResponseBlock = ({ status, data }: Props) => {
  const content = data ? JSON.stringify(data, null, 2) : null;

  return (
    <textarea
      rows={10}
      value={`Status: ${status}\n\n${content ?? ''}`}
      readOnly
    />
  );
};

export default ResponseBlock;
