'use client';

import { toast, ToastContainer } from 'react-toastify';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import './error-test.css';

function CrashComponent() {
  const { t } = useTranslation();
  throw new Error(t('errorTest.reactComponentError'));
  return null;
}

export default function ErrorTestPage() {
  const { t } = useTranslation();
  const [crash, setCrash] = useState(false);

  const handleThrowJsError = () => {
    throw new Error(t('errorTest.throwJsError'));
  };

  const handleUnhandledRejection = () => {
    Promise.reject(new Error(t('errorTest.unhandledRejection')));
  };

  const handleNetworkError = async () => {
    try {
      await fetch('https://nonexistent.domain.abc');
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(`${t('errorTest.networkError')}: ${e.message}`);
      } else {
        toast.error(t('errorTest.networkError'));
      }
    }
  };

  const handleHttpError = async () => {
    try {
      const res = await fetch(
        'https://jsonplaceholder.typicode.com/unknown-endpoint'
      );
      const text = await res.text();
      if (!res.ok) {
        toast.error(`${t('errorTest.httpError')} ${res.status}: ${text}`);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(`${t('errorTest.otherError')}: ${e.message}`);
      } else {
        toast.error(t('errorTest.otherError'));
      }
    }
  };

  return (
    <ErrorBoundary>
      <ToastContainer />
      <div className="error-test-container">
        <h1 className="error-test-title">{t('errorTest.title')}</h1>
        <ul className="error-test-list">
          <li>
            <button onClick={() => setCrash(true)}>
              {t('errorTest.buttons.reactCrash')}
            </button>
          </li>
          <li>
            <button onClick={handleThrowJsError}>
              {t('errorTest.buttons.jsError')}
            </button>
          </li>
          <li>
            <button onClick={handleUnhandledRejection}>
              {t('errorTest.buttons.unhandledRejection')}
            </button>
          </li>
          <li>
            <button onClick={handleNetworkError}>
              {t('errorTest.buttons.network')}
            </button>
          </li>
          <li>
            <button onClick={handleHttpError}>
              {t('errorTest.buttons.http')}
            </button>
          </li>
        </ul>
        {crash && <CrashComponent />}
      </div>
    </ErrorBoundary>
  );
}
