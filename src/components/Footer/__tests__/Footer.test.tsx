import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders three GitHub links, year, and course logo', () => {
    render(<Footer />);

    expect(screen.getByText('exact84')).toHaveAttribute(
      'href',
      'https://github.com/exact84'
    );
    expect(screen.getByText('kirillnev')).toHaveAttribute(
      'href',
      'https://github.com/kirillnev'
    );
    expect(screen.getByText('jull-nevinskaya')).toHaveAttribute(
      'href',
      'https://github.com/jull-nevinskaya'
    );

    expect(
      screen.getByText(`© ${new Date().getFullYear()} REST Client`)
    ).toBeInTheDocument();

    const courseLogo = screen.getByAltText('Course Logo');
    expect(courseLogo).toBeInTheDocument();
    expect(courseLogo.closest('a')).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
  });
});
