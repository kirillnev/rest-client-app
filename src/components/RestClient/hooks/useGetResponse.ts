import { useEffect } from 'react';
import { sendRequestRaw } from '@/utils/requestUtils';
import { ResponseDataType, RestRequest } from '@/types';

type Props = {
  request: RestRequest | null;
  setIsLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
  setResponseData: (v: ResponseDataType) => void;
  setResponseStatus: (v: number | null) => void;
};

export const useGetResponse = ({
  request,
  setIsLoading,
  setError,
  setResponseData,
  setResponseStatus,
}: Props) => {
  useEffect(() => {
    if (!request) return;

    const fetch = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setResponseData(null);
        setResponseStatus(null);

        const response = await sendRequestRaw(request);
        setResponseStatus(response.status);
        setResponseData(response.body);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    void fetch();
  }, [request]);
};
