'use client';

import { useEffect, useState } from 'react';
import './error-pages.css';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    console.error(error);
    setShow(true);
  }, [error]);

  if (!show) return null;

  return (
    <div className="error-alert" role="alert">
      <strong className="error-title">Error: </strong>
      <span>{error.message}</span>
      <div className="error-buttons">
        <button
          className="error-button"
          onClick={() => {
            setShow(false);
            reset();
          }}
        >
          Try again
        </button>
        <button className="error-close" onClick={() => setShow(false)}>
          Закрыть
        </button>
      </div>
    </div>
  );
}
