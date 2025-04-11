import { useEffect, useState } from 'react';
import { RestRequest } from '@/types';
import { generateCode } from '@/utils/codegen';

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
    generateCode(request, language).then(setCode);
  }, [request, language]);

  return {
    language,
    setLanguage,
    code,
    languages,
  };
};
