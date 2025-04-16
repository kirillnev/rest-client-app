import { render, screen } from '@testing-library/react';
import React from 'react';
import HomePage from '@/app/home/page';

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: jest.fn((importFn, options) => {
    const Component = () => {
      const Loading = options.loading;
      return (
        <>
          <div data-testid="welcome-rest">Mocked WelcomeREST</div>
          <Loading />
        </>
      );
    };
    return Component;
  }),
}));

jest.mock('@/components/Nav', () => ({
  __esModule: true,
  default: () => <nav data-testid="nav">Mocked Nav</nav>,
}));

jest.mock('@/components/auth/RequireAuth', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-wrapper">{children}</div>
  ),
}));

jest.mock('@/components/Loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading...</div>,
}));

describe('HomePage', () => {
  it('renders dynamic WelcomeREST with Loading and Nav', () => {
    render(<HomePage />);

    expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('welcome-rest')).toBeInTheDocument();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveClass('welcome-main');
  });

  it('calls dynamic with loader and loading options', async () => {
    const { default: dynamic } = await import('next/dynamic');
    const mockedDynamic = dynamic as jest.Mock;
    expect(dynamic).toHaveBeenCalled();

    const [importFn, options] = mockedDynamic.mock.calls[0];
    expect(typeof importFn).toBe('function');
    expect(typeof options.loading).toBe('function');
  });
});
