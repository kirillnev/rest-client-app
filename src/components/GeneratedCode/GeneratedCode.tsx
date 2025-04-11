import { useGeneratedCode } from './hooks/useGeneratedCode';
import { RestRequest } from '@/types';

interface Props {
  request: RestRequest;
}

const GeneratedCode = ({ request }: Props) => {
  const { language, setLanguage, code, languages } = useGeneratedCode(request);

  return (
    <div>
      <label htmlFor="language-select">Language: </label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value as typeof language)}
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
