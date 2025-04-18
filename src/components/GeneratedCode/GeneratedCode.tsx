import { useGeneratedCode } from './hooks/useGeneratedCode';
import { RestRequest } from '@/types';
import '../RestClient/rest-client.css';

interface Props {
  request: RestRequest;
}

const GeneratedCode = ({ request }: Props) => {
  const { language, setLanguage, code, languages } = useGeneratedCode(request);

  return (
    <div className="generated-code-container">
      <h3 className="generated-code-title">Generated Code</h3>

      <div className="generated-code-select">
        <label htmlFor="language-select">Language:</label>
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
      </div>

      <textarea
        className="generated-code-textarea"
        rows={10}
        value={code}
        readOnly
      />
    </div>
  );
};

export default GeneratedCode;
