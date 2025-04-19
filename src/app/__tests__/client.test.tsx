import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('@/components/auth/RequireAuth', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="require-auth">{children}</div>
  ),
}));

jest.mock('next/dynamic', () => () => {
  const MockRestClient = () => <div data-testid="rest-client">RestClient</div>;
  return MockRestClient;
});

import ClientPage from '../client/[[...params]]/page';

describe('ClientPage', () => {
  it('renders RestClient inside RequireAuth', () => {
    render(<ClientPage />);
    expect(screen.getByTestId('require-auth')).toBeInTheDocument();
    expect(screen.getByTestId('rest-client')).toBeInTheDocument();
  });
});
