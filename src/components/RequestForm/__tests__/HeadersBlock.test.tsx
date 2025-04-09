import { render, screen, fireEvent } from '@testing-library/react';
import HeadersBlock from '../HeadersBlock';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { RestRequest } from '@/types';
import type { FieldArrayWithId } from 'react-hook-form';

const fields: FieldArrayWithId<RestRequest, 'headers', 'id'>[] = [
  { id: '1', key: '', value: '' },
  { id: '2', key: '', value: '' },
];
const registerMock = jest.fn(() => ({}));
const appendMock = jest.fn();
const removeMock = jest.fn();

const setup = (errors: FieldErrors<RestRequest> = {}) => {
  render(
    <HeadersBlock
      register={registerMock as unknown as UseFormRegister<RestRequest>}
      errors={errors}
      fields={fields}
      append={appendMock}
      remove={removeMock}
    />
  );
};

test('renders headers inputs and add button', () => {
  setup();
  expect(screen.getAllByPlaceholderText(/Key/i)).toHaveLength(2);
  expect(screen.getAllByPlaceholderText(/Value/i)).toHaveLength(2);
  expect(screen.getAllByRole('button', { name: '' })).toHaveLength(2); // remove buttons
  expect(screen.getByText(/Add header/i)).toBeInTheDocument();
});

test('calls remove on remove button click', () => {
  setup();
  fireEvent.click(screen.getAllByRole('button', { name: '' })[1]);
  expect(removeMock).toHaveBeenCalledWith(1);
});

test('calls append on Add header click', () => {
  setup();
  fireEvent.click(screen.getByText(/Add header/i));
  expect(appendMock).toHaveBeenCalledWith({ key: '', value: '' });
});

test('shows error message if header key has error', () => {
  const errors: FieldErrors<RestRequest> = {
    headers: [{ key: { type: 'manual', message: 'Key is required' } }, {}],
  };
  setup(errors);
  expect(screen.getByText(/Key is required/i)).toBeInTheDocument();
});
