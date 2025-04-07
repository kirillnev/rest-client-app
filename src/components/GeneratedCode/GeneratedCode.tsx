import { useEffect, useState } from 'react';
import { getCodeSnippet } from '@/utils/codegen';
import { RestRequest } from '@/types';

interface Props {
  request: RestRequest;
}

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

const GeneratedCode = ({ request }: Props) => {
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
      headers: request.headers, // передаём массив
      body: request.body,
      language,
    }).then(setCode);
  }, [request, language]);

  return (
    <div>
      <label htmlFor="language-select">Language: </label>
      <select
        id="language-select"
        value={language}
        onChange={(e) =>
          setLanguage(e.target.value as (typeof languages)[number])
        }
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      <div>
        <textarea rows={10} value={code} readOnly />
      </div>
    </div>
  );
};

export default GeneratedCode;
