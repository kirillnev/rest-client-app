import { useParams, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { RestRequest } from '@/types';
import { parseRestRequest } from '@/utils/requestUtils';

export const useDecodedRequestParams = (): RestRequest | null => {
  const { params } = useParams() as { params?: string[] };
  const searchParams = useSearchParams();

  return useMemo(
    () => parseRestRequest(params, searchParams),
    [params, searchParams]
  );
};
