import { useRouter } from 'next/navigation';
import { buildRestUrl } from '@/utils/requestUtils';
import { saveToHistory } from '@/utils/localStorageUtils';
import { RestRequest } from '@/types';
import { replaceVariables } from '@/utils/variables';
import { useVariables } from '@/components/RestClient/hooks/useVariables';

export const useSubmitRequest = () => {
  const router = useRouter();
  const variables = useVariables();

  return (data: RestRequest) => {
    const replaced = replaceVariables(data, variables);
    saveToHistory({ ...replaced, createdAt: Date.now() });
    const url = buildRestUrl(replaced, '/client');
    router.push(url);
  };
};
