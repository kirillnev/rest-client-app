import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ComponentType, JSX } from 'react';

jest.mock('@/components/auth/RequireAuth', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="require-auth">{children}</div>
  ),
}));

describe('HistoryPage - with HistorySection loaded', () => {
  jest.resetModules();

  jest.mock('next/dynamic', () => () => {
    const MockHistory = () => (
      <div data-testid="history-section">HistorySection</div>
    );
    return MockHistory;
  });

  const HistoryPage = require('../history/page').default;

  it('renders HistorySection inside RequireAuth', () => {
    render(<HistoryPage />);
    expect(screen.getByTestId('require-auth')).toBeInTheDocument();
    expect(screen.getByTestId('history-section')).toBeInTheDocument();
  });
});

describe('HistoryPage - shows loading state', () => {
  jest.resetModules();

  jest.mock(
    'next/dynamic',
    () =>
      (
        importFunc: () => Promise<{ default: ComponentType }>,
        options: { loading: () => JSX.Element }
      ) => {
        const LoadingWrapper = () => (
          <div data-testid="loading-wrapper">{options.loading()}</div>
        );
        return LoadingWrapper;
      }
  );

  const HistoryPage = require('../history/page').default;

  it('renders loading component from dynamic import', () => {
    render(<HistoryPage />);
    expect(screen.getAllByTestId('loading')).toHaveLength(1);
    expect(screen.getByTestId('loading-wrapper')).toBeInTheDocument();
  });
});
