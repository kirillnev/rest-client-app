'use client';

import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function ErrorEventsHandler() {
  const { t } = useTranslation();

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      toast.error(t('globalErrors.unhandledRejection'));
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.message);
      toast.error(t('globalErrors.runtimeError'));
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}
