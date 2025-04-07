import sdk from 'postman-collection';
import codegen from 'postman-code-generators';
import { RequestHeader } from '@/types';

interface Params {
  method: string;
  url: string;
  headers: RequestHeader[];
  body: string;
  language: string;
}

const langMap: { [key: string]: { language: string; variant: string } } = {
  curl: { language: 'curl', variant: 'cURL' },
  'javascript-fetch': { language: 'javascript', variant: 'Fetch' },
  'javascript-xhr': { language: 'javascript', variant: 'XHR' },
  nodejs: { language: 'nodejs', variant: 'Request' },
  python: { language: 'python', variant: 'Requests' },
  java: { language: 'java', variant: 'OkHttp' },
  go: { language: 'go', variant: 'Native' },
  csharp: { language: 'csharp', variant: 'HttpClient' },
};

export async function getCodeSnippet({
  method,
  url,
  headers,
  body,
  language,
}: Params): Promise<string> {
  return new Promise((resolve) => {
    const postmanRequest = new sdk.Request({
      url,
      method,
      header: headers
        .filter((h) => h.key)
        .map(({ key, value }) => ({ key, value })),
      body: new sdk.RequestBody({ mode: 'raw', raw: body }),
    });

    codegen.convert(
      langMap[language].language,
      langMap[language].variant,
      postmanRequest,
      {
        indentCount: 2,
        indentType: 'Space',
        trimRequestBody: true,
        followRedirect: true,
      },
      (error: Error | null, snippet: string | null) => {
        if (error || !snippet) {
          resolve('Error generating code');
          return;
        }
        resolve(snippet);
      }
    );
  });
}
