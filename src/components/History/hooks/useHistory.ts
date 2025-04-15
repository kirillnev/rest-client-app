import { useEffect, useState } from 'react';
import { HistoryItem } from '@/types';
import { getFromHistory } from '@/utils/localStorageUtils';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getFromHistory());
  }, []);

  return { history };
};
