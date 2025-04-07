import React from 'react';

type Props = {
  status: number;
  data: string | object | null;
};

const ResponseBlock = ({ status, data }: Props) => {
  const content =
    typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  return (
    <div className="response-block">
      <div className="response-status">Status: {status}</div>
      {data && <pre>{content}</pre>}
    </div>
  );
};

export default ResponseBlock;
