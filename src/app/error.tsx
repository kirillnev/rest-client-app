'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './error-pages.css';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(true);

  useEffect(() => {
    console.error(error);
    setShow(true);
  }, [error]);

  if (!show) return null;

  return (
    <div className="error-alert" role="alert">
      <strong className="error-title">{t('error.alert.title')} </strong>
      <span>{error.message}</span>
      <div className="error-buttons">
        <button
          className="error-button"
          onClick={() => {
            setShow(false);
            reset();
          }}
        >
          {t('error.alert.tryAgain')}
        </button>
        <button className="error-close" onClick={() => setShow(false)}>
          {t('error.alert.close')}
        </button>
      </div>
    </div>
  );
}
