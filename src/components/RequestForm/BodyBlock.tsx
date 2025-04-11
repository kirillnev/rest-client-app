import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { RestRequest } from '@/types';

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
}: Props) => (
  <>
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
      {errors.body && <span className="error">{errors.body.message}</span>}
    </div>
  </>
);

export default BodyBlock;
