import { useEffect, useState } from 'react';
import { HistoryItem } from '@/types';
import { getFromHistory, clearHistory } from '@/utils/localStorageUtils';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getFromHistory());
  }, []);

  const onClear = () => {
    clearHistory();
    setHistory([]);
  };

  return { history, onClear };
};
