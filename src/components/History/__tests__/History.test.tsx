import { render, screen, fireEvent } from '@testing-library/react';
import History from '../History';
import { useHistory } from '../hooks/useHistory';

jest.mock('../hooks/useHistory');

const mockedUseHistory = useHistory as jest.MockedFunction<typeof useHistory>;

describe('HistoryPage', () => {
  test('renders empty state', () => {
    mockedUseHistory.mockReturnValue({ history: [], onClear: jest.fn() });

    render(<History />);

    expect(screen.getByTestId('history-empty')).toBeInTheDocument();
  });

  test('renders list of history items', () => {
    mockedUseHistory.mockReturnValue({
      history: [
        {
          method: 'GET',
          url: 'https://example.com',
          headers: [],
          body: '',
          bodyType: 'text',
          createdAt: 1,
        },
        {
          method: 'POST',
          url: 'https://api.test.dev',
          headers: [],
          body: '{"data":"ok"}',
          bodyType: 'json',
          createdAt: 2,
        },
      ],
      onClear: jest.fn(),
    });

    render(<History />);

    expect(screen.getByTestId('history-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('history-item')).toHaveLength(2);
    expect(screen.getByTestId('history-link-1')).toHaveTextContent(
      '[GET] https://example.com'
    );
    expect(screen.getByTestId('history-link-2')).toHaveTextContent(
      '[POST] https://api.test.dev'
    );
    expect(screen.getByTestId('clear-history')).toBeInTheDocument();
  });

  test('calls onClear when clear button is clicked', () => {
    const onClear = jest.fn();

    mockedUseHistory.mockReturnValue({
      history: [
        {
          method: 'GET',
          url: 'https://example.com',
          headers: [],
          body: '',
          bodyType: 'text',
          createdAt: 1,
        },
      ],
      onClear,
    });

    render(<History />);
    fireEvent.click(screen.getByTestId('clear-history'));

    expect(onClear).toHaveBeenCalled();
  });
});
