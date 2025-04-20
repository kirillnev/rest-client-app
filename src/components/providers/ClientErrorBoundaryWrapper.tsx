'use client';

import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import ErrorEventsHandler from '@/components/providers/ErrorEventsHandler';
import { ToastContainer } from 'react-toastify';

export default function ClientErrorBoundaryWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <ToastContainer position="top-right" autoClose={5000} />
      <ErrorEventsHandler />
      {children}
    </ErrorBoundary>
  );
}
