import { useEffect, useState } from 'react';
import { RestRequest } from '@/types';
import { generateCode } from '@/utils/codegen';
import { replaceVariables } from '@/utils/variables';
import { useVariables } from '@/components/RestClient/hooks/useVariables';

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
  const variables = useVariables();

  useEffect(() => {
    const replaced = replaceVariables(request, variables);
    generateCode(replaced, language).then(setCode);
  }, [request, language]);

  return {
    language,
    setLanguage,
    code,
    languages,
  };
};
