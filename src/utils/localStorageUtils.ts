import { HistoryItem } from '@/types';

const HISTORY_LOCAL_STORAGE_KEY = 'rest-client-history';

export const saveToHistory = (historyItem: HistoryItem) => {
  const history: HistoryItem[] = JSON.parse(
    localStorage.getItem(HISTORY_LOCAL_STORAGE_KEY) || '[]'
  );

  localStorage.setItem(
    HISTORY_LOCAL_STORAGE_KEY,
    JSON.stringify([historyItem, ...history])
  );
};

export const getFromHistory = (): HistoryItem[] =>
  JSON.parse(localStorage.getItem(HISTORY_LOCAL_STORAGE_KEY) || '[]');
