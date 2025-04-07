import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { RestRequest } from '@/types';
import { prettifyJson } from '@/utils/prettifyJson';

type Props = {
  form: UseFormReturn<RestRequest>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
};

const RequestForm = ({ form, onSubmit, isLoading }: Props) => {
  const { register, control, watch, getValues, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'headers',
  });

  const watchedBodyType = watch('bodyType');

  const handlePrettify = () => {
    const pretty = prettifyJson(getValues('body'));
    if (pretty) setValue('body', pretty);
  };

  return (
    <form onSubmit={onSubmit} className="request-form">
      <fieldset disabled={isLoading}>
        <div className="method-url-row">
          <select {...register('method')}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
          <input {...register('url')} placeholder="Enter URL" />
        </div>

        <div className="headers-block">
          {fields.map((field, index) => (
            <div key={field.id} className="header-row">
              <input {...register(`headers.${index}.key`)} placeholder="Key" />
              <input
                {...register(`headers.${index}.value`)}
                placeholder="Value"
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="icon-button remove"
                />
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ key: '', value: '' })}
            className="add-link"
          >
            Add header
          </button>
        </div>

        <div className="body-type-row">
          <label>
            <input
              type="radio"
              value="text"
              {...register('bodyType')}
              defaultChecked
            />
            Text
          </label>
          <label>
            <input type="radio" value="json" {...register('bodyType')} />
            JSON
          </label>

          {watchedBodyType === 'json' && (
            <button type="button" onClick={handlePrettify}>
              Prettify
            </button>
          )}
        </div>

        <div className="body-row">
          <textarea {...register('body')} placeholder="Request Body" />
        </div>

        <button type="submit">{isLoading ? 'Sending...' : 'Send'}</button>
      </fieldset>
    </form>
  );
};

export default RequestForm;
