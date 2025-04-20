import { RestRequest, Variable } from '@/types';

export const replaceVariables = (
  request: RestRequest,
  variables: Variable[] = []
): RestRequest => {
  const replace = (str: string) => {
    if (!str) return str;

    return variables.reduce(
      (acc, v) => acc.replaceAll(`{{${v.key}}}`, v.value),
      str
    );
  };

  return {
    ...request,
    url: replace(request.url),
    body: replace(request.body),
    headers: request.headers.map((h) => ({
      key: h.key,
      value: replace(h.value),
    })),
  };
};
