import { useEffect, useState } from 'react';
import { Variable } from '@/types';
import { getVariables } from '@/utils/localStorageUtils';

export const useVariables = () => {
  const [variables, setVariables] = useState<Variable[]>([]);

  useEffect(() => {
    setVariables(getVariables());
  }, []);

  return variables;
};
