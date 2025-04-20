import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { RestRequest } from '@/types';

type Props = {
  register: UseFormRegister<RestRequest>;
  errors: FieldErrors<RestRequest>;
};

const MethodUrlBlock = ({ register, errors }: Props) => (
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
    {errors.url && <span className="error">{errors.url.message}</span>}
  </div>
);

export default MethodUrlBlock;
