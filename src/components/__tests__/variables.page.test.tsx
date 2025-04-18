import React from 'react';
import { render, screen } from '@testing-library/react';
import VariablesPage from '../../app/variables/page';

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: jest.fn((loader, options) => {
    const Component = () => {
      const Loading = options?.loading ?? (() => null);
      return (
        <>
          <div data-testid="variables">Variables Component</div>
          <Loading />
        </>
      );
    };
    Component.displayName = 'DynamicComponent';
    return Component;
  }),
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

describe('VariablesPage Component', () => {
  it('renders the RequireAuth wrapper and the dynamic Variables component', () => {
    render(<VariablesPage />);

    expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('variables')).toBeInTheDocument();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('sets up dynamic import correctly with loading component', async () => {
    const { default: dynamic } = await import('next/dynamic');
    const mockedDynamic = dynamic as jest.Mock;
    expect(dynamic).toHaveBeenCalled();

    const [loader, options] = mockedDynamic.mock.calls[0];
    expect(typeof loader).toBe('function');
    expect(typeof options.loading).toBe('function');
  });
});
