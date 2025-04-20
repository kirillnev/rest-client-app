import { HistoryItem, Variable } from '@/types';

const HISTORY_LOCAL_STORAGE_KEY = 'rest-client-history';
const VARIABLES_LOCAL_STORAGE_KEY = 'variables';

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

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_LOCAL_STORAGE_KEY);
};

export const getVariables = (): Variable[] => {
  try {
    const raw = localStorage.getItem(VARIABLES_LOCAL_STORAGE_KEY);
    const obj = JSON.parse(raw || '{}');
    return Object.entries(obj).map(([key, value]) => ({
      key,
      value: String(value),
    }));
  } catch {
    return [];
  }
};
