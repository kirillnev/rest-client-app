import { render, screen, fireEvent } from '@testing-library/react';
import ErrorComponent from '@/app/error';

describe('Error Component', () => {
  const mockReset = jest.fn();
  const mockError = new Error('Test error message') as Error;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders error message and title', () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('logs error to console on mount', () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });

  it('calls reset when button is clicked', () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);
    fireEvent.click(screen.getByText('Try again'));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
