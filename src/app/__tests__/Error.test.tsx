import { render, screen, fireEvent } from '@testing-library/react';
import ErrorComponent from '@/app/error';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'error.alert.title': 'Error:',
        'error.alert.tryAgain': 'Try again',
        'error.alert.close': 'Close',
      };
      return map[key] || key;
    },
  }),
}));

describe('Error Component', () => {
  const mockReset = jest.fn();
  const mockError = new Error('Test error message') as Error;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders error message and translated title', () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Error:')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('logs error to console on mount', () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });

  it('calls reset when "Try again" button is clicked', () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);
    fireEvent.click(screen.getByText('Try again'));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('hides component when "Close" is clicked', () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
