import { useEffect, useState } from 'react';
import { RestRequest } from '@/types';
import { getCodeSnippet } from '@/utils/codegen';

const languages = [
  'curl',
  'javascript-fetch',
  'javascript-xhr',
  'nodejs',
  'python',
  'java',
  'csharp',
  'go',
] as const;

export const useGeneratedCode = (request: RestRequest) => {
  const [language, setLanguage] = useState<(typeof languages)[number]>('curl');
  const [code, setCode] = useState('');

  useEffect(() => {
    if (!request.method || !request.url) {
      setCode('Not enough data to generate code.');
      return;
    }

    getCodeSnippet({
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body,
      language,
    }).then(setCode);
  }, [request, language]);

  return {
    language,
    setLanguage,
    code,
    languages,
  };
};
