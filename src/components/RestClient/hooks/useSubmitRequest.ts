import { useRouter } from 'next/navigation';
import { buildRestUrl, sendRequestRaw } from '@/utils/requestUtils';
import { saveToHistory } from '@/utils/localStorageUtils';
import { RestRequest, ResponseDataType } from '@/types';

type Props = {
  setIsLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
  setResponseData: (v: ResponseDataType) => void;
  setResponseStatus: (v: number | null) => void;
};

export const useSubmitRequest = ({
  setIsLoading,
  setError,
  setResponseData,
  setResponseStatus,
}: Props) => {
  const router = useRouter();

  return async (data: RestRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      setResponseData(null);
      setResponseStatus(null);

      const url = buildRestUrl(data);
      router.push(url);

      const response = await sendRequestRaw(data);
      setResponseStatus(response.status);
      setResponseData(response.body);
      saveToHistory({ ...data, createdAt: Date.now() });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
};
