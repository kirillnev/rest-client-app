import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('@/components/auth/RequireAuth', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="require-auth">{children}</div>
  ),
}));

jest.mock('next/dynamic', () => () => {
  const MockHistory = () => (
    <div data-testid="history-section">HistorySection</div>
  );
  return MockHistory;
});

import HistoryPage from '../history/page';

describe('HistoryPage', () => {
  it('renders HistorySection inside RequireAuth', () => {
    render(<HistoryPage />);
    expect(screen.getByTestId('require-auth')).toBeInTheDocument();
    expect(screen.getByTestId('history-section')).toBeInTheDocument();
  });
});
