import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../useHistory';
import { getFromHistory, clearHistory } from '@/utils/localStorageUtils';
import { HistoryItem } from '@/types';

jest.mock('@/utils/localStorageUtils', () => ({
  getFromHistory: jest.fn(),
  clearHistory: jest.fn(),
}));

const mockHistory: HistoryItem[] = [
  {
    method: 'GET',
    url: 'https://example.com',
    body: '',
    bodyType: 'text',
    headers: [],
    createdAt: 123,
  },
];

test('loads history on mount', () => {
  (getFromHistory as jest.Mock).mockReturnValue(mockHistory);
  const { result } = renderHook(() => useHistory());
  expect(result.current.history).toEqual(mockHistory);
});

test('clears history on onClear', () => {
  (getFromHistory as jest.Mock).mockReturnValue(mockHistory);
  const { result } = renderHook(() => useHistory());

  act(() => {
    result.current.onClear();
  });

  expect(clearHistory).toHaveBeenCalled();
  expect(result.current.history).toEqual([]);
});
