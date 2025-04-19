import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('NotFound', () => {
  it('renders 404 message', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders link to home', () => {
    render(<NotFound />);
    expect(screen.getByText('error.notFound.back')).toHaveAttribute(
      'href',
      '/'
    );
  });
});
