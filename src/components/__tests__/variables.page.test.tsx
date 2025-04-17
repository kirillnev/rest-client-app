import React from 'react';
import { render, screen } from '@testing-library/react';
import VariablesPage from '../../app/variables/page';

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: jest.fn((loader, options) => {
    const Component = () => {
      const Loading = options.loading;
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

jest.mock('@/components/Nav', () => ({
  __esModule: true,
  default: () => <nav data-testid="nav">Navigation</nav>,
}));

jest.mock('@/components/Loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading...</div>,
}));

describe('VariablesPage Component', () => {
  it('renders all components including dynamic import', () => {
    render(<VariablesPage />);

    expect(screen.getByTestId('auth-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('variables')).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('has correct main element class', () => {
    render(<VariablesPage />);
    expect(screen.getByRole('main')).toHaveClass('welcome-main');
  });

  it('properly sets up dynamic import', async () => {
    const { default: dynamic } = await import('next/dynamic');
    const mockedDynamic = dynamic as jest.Mock;
    expect(dynamic).toHaveBeenCalled();

    const call = mockedDynamic.mock.calls[0];
    expect(call[0]).toBeInstanceOf(Function);
    expect(typeof call[1].loading).toBe('function');
  });
});
