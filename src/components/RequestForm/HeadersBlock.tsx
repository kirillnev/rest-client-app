import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { RestRequest } from '@/types';
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from 'react-hook-form';

type Props = {
  register: UseFormRegister<RestRequest>;
  errors: FieldErrors<RestRequest>;
  fields: FieldArrayWithId<RestRequest, 'headers', 'id'>[];
  append: UseFieldArrayAppend<RestRequest, 'headers'>;
  remove: UseFieldArrayRemove;
};

const HeadersBlock = ({ register, errors, fields, append, remove }: Props) => (
  <div className="headers-block">
    {fields.map((field, index) => (
      <div key={field.id} className="header-wrapper">
        <div className="header-row">
          <input {...register(`headers.${index}.key`)} placeholder="Key" />
          <input {...register(`headers.${index}.value`)} placeholder="Value" />
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
      Add header
    </button>
  </div>
);

export default HeadersBlock;
