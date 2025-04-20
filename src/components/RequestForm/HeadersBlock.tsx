import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { RestRequest } from '@/types';
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type Props = {
  register: UseFormRegister<RestRequest>;
  errors: FieldErrors<RestRequest>;
  fields: FieldArrayWithId<RestRequest, 'headers', 'id'>[];
  append: UseFieldArrayAppend<RestRequest, 'headers'>;
  remove: UseFieldArrayRemove;
};

const HeadersBlock = ({ register, errors, fields, append, remove }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="headers-block">
      {fields.map((field, index) => (
        <div key={field.id} className="header-wrapper">
          <div className="header-row">
            <input
              {...register(`headers.${index}.key`)}
              placeholder={t('request.headers.keyPlaceholder')}
            />
            <input
              {...register(`headers.${index}.value`)}
              placeholder={t('request.headers.valuePlaceholder')}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="icon-button remove"
            />
          </div>
          {errors.headers?.[index]?.key && (
            <span className="error">{errors.headers[index].key?.message}</span>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ key: '', value: '' })}
        className="add-link-btn"
      >
        {t('request.headers.addButton')}
      </button>
    </div>
  );
};

export default HeadersBlock;
