import { UseFormReturn } from 'react-hook-form';
import { RestRequest } from '@/types';
import { useRequestForm } from './hooks/useRequestForm';

type Props = {
  form: UseFormReturn<RestRequest>;
  onSubmit: (data: RestRequest) => Promise<void>;
  isLoading: boolean;
};

const RequestForm = ({ form, onSubmit, isLoading }: Props) => {
  const { register } = form;
  const { fields, append, remove, watchedBodyType, handlePrettify } =
    useRequestForm(form);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="rest-client-form">
      <fieldset disabled={isLoading}>
        <div className="method-url-wrapper">
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
          {form.formState.errors.url && (
            <span className="error">{form.formState.errors.url.message}</span>
          )}
        </div>

        <div className="headers-block">
          {fields.map((field, index) => (
            <div key={field.id} className="header-wrapper">
              <div className="header-row">
                <input
                  {...register(`headers.${index}.key`)}
                  placeholder="Key"
                />
                <input
                  {...register(`headers.${index}.value`)}
                  placeholder="Value"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="icon-button remove"
                />
              </div>
              {form.formState.errors.headers?.[index]?.key && (
                <span className="error">
                  {form.formState.errors.headers[index].key?.message}
                </span>
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
          {form.formState.errors.body && (
            <span className="error">{form.formState.errors.body.message}</span>
          )}
        </div>

        <button type="submit">{isLoading ? 'Sending...' : 'Send'}</button>
      </fieldset>
    </form>
  );
};

export default RequestForm;
