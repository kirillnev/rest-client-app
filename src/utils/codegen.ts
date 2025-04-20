import sdk from 'postman-collection';
import codegen from 'postman-code-generators';
import { RestRequest } from '@/types';

const langMap = {
  curl: { language: 'curl', variant: 'cURL' },
  'javascript-fetch': { language: 'javascript', variant: 'Fetch' },
  'javascript-xhr': { language: 'javascript', variant: 'XHR' },
  nodejs: { language: 'nodejs', variant: 'Request' },
  python: { language: 'python', variant: 'Requests' },
  java: { language: 'java', variant: 'OkHttp' },
  go: { language: 'go', variant: 'Native' },
  csharp: { language: 'csharp', variant: 'HttpClient' },
} as const;

type LanguageKey = keyof typeof langMap;

const convertRequestToCode = async (
  request: sdk.Request,
  language: LanguageKey
): Promise<string> => {
  const { language: lang, variant } = langMap[language];

  return new Promise((resolve) => {
    codegen.convert(
      lang,
      variant,
      request,
      {
        indentCount: 2,
        indentType: 'Space',
        trimRequestBody: true,
        followRedirect: true,
      },
      (error: Error | null, snippet: string | null) => {
        if (error || !snippet) {
          resolve('Error generating code');
        } else {
          resolve(snippet);
        }
      }
    );
  });
};

export const generateCode = async (
  request: RestRequest,
  language: LanguageKey
): Promise<string> => {
  if (!request.method || !request.url) {
    return '';
  }

  const headers = request.headers
    .filter((h) => h.key)
    .map(({ key, value }) => ({ key, value }));

  const postmanRequest = new sdk.Request({
    url: request.url,
    method: request.method,
    header: headers,
    body: request.body
      ? new sdk.RequestBody({ mode: 'raw', raw: request.body })
      : undefined,
  });

  return await convertRequestToCode(postmanRequest, language);
};
