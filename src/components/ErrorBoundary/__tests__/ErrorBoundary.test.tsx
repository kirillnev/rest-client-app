import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';

jest.mock('react-i18next', () => ({
  withTranslation:
    () =>
    <P extends object>(Component: React.ComponentType<P>) => {
      const WrappedComponent = (props: P) => (
        <Component {...props} t={(key: string) => key} />
      );
      WrappedComponent.displayName = `withTranslation(${Component.displayName || Component.name || 'Component'})`;
      return WrappedComponent;
    },
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const ThrowingComponent = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('renders children if no error', () => {
    render(
      <ErrorBoundary>
        <div>Safe Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe Content')).toBeInTheDocument();
  });

  it('renders fallback UI on error', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('errorBoundary.title')).toBeInTheDocument();
    expect(screen.getByText('errorBoundary.description')).toBeInTheDocument();
  });

  it('calls toast.error with translated message on error', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining('errorBoundary.toast')
    );
  });
});
