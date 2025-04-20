import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { RestRequest } from '@/types';
import { useTranslation } from 'react-i18next';

type Props = {
  register: UseFormRegister<RestRequest>;
  errors: FieldErrors<RestRequest>;
  watchedBodyType: string;
  handlePrettify: () => void;
};

const BodyBlock = ({
  register,
  errors,
  watchedBodyType,
  handlePrettify,
}: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="body-type-row">
        <label>
          <input
            type="radio"
            value="text"
            {...register('bodyType')}
            defaultChecked
          />
          {t('request.body.type.text')}
        </label>
        <label>
          <input type="radio" value="json" {...register('bodyType')} />
          {t('request.body.type.json')}
        </label>
        {watchedBodyType === 'json' && (
          <button type="button" onClick={handlePrettify}>
            {t('request.body.prettify')}
          </button>
        )}
      </div>
      <div className="body-row">
        <textarea
          {...register('body')}
          placeholder={t('request.body.placeholder')}
        />
        {errors.body && <span className="error">{errors.body.message}</span>}
      </div>
    </>
  );
};

export default BodyBlock;
