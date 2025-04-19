import { useRouter } from 'next/navigation';
import { buildRestUrl } from '@/utils/requestUtils';
import { saveToHistory } from '@/utils/localStorageUtils';
import { RestRequest } from '@/types';

export const useSubmitRequest = () => {
  const router = useRouter();

  return (data: RestRequest) => {
    saveToHistory({ ...data, createdAt: Date.now() });
    const url = buildRestUrl(data, '/client');
    router.push(url);
  };
};
