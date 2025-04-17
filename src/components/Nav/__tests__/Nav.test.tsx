import { render, screen } from '@testing-library/react';
import Nav from '../Nav';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import { AnchorHTMLAttributes, ReactNode } from 'react';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('next/link', () => {
  const MockLink = ({
    href,
    children,
    className,
    ...props
  }: {
    href: string;
    children: ReactNode;
    className?: string;
  } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );

  MockLink.displayName = 'MockLink';

  return MockLink;
});

describe('Nav', () => {
  const mockT = (key: string) => {
    const translations: Record<string, string> = {
      'nav.restClient': 'REST Client',
      'nav.history': 'History',
      'nav.variables': 'Variables',
    };
    return translations[key] || key;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTranslation as jest.Mock).mockReturnValue({
      t: mockT,
      i18n: { language: 'en' },
    });
  });

  it('renders all navigation links', () => {
    (usePathname as jest.Mock).mockReturnValue('/client');
    render(<Nav />);
    expect(screen.getByText('REST Client')).toHaveAttribute('href', '/client');
    expect(screen.getByText('History')).toHaveAttribute('href', '/history');
    expect(screen.getByText('Variables')).toHaveAttribute('href', '/variables');
  });

  it('applies active class to current pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/client');
    render(<Nav />);
    expect(screen.getByText('REST Client')).toHaveClass('nav-link active');
    expect(screen.getByText('History')).toHaveClass('nav-link');
    expect(screen.getByText('Variables')).toHaveClass('nav-link');
  });

  it('applies active class to different pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/history');
    render(<Nav />);
    expect(screen.getByText('REST Client')).toHaveClass('nav-link');
    expect(screen.getByText('History')).toHaveClass('nav-link active');
    expect(screen.getByText('Variables')).toHaveClass('nav-link');
  });

  it('renders without active class when pathname is unrelated', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<Nav />);
    expect(screen.getByText('REST Client')).toHaveClass('nav-link');
    expect(screen.getByText('History')).toHaveClass('nav-link');
    expect(screen.getByText('Variables')).toHaveClass('nav-link');
  });
});
