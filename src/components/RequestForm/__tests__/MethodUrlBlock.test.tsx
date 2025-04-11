import { render, screen } from '@testing-library/react';
import MethodUrlBlock from '../MethodUrlBlock';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { RestRequest } from '@/types';

const registerMock = jest.fn(() => ({}));

const setup = (errors: FieldErrors<RestRequest> = {}) => {
  render(
    <MethodUrlBlock
      register={registerMock as unknown as UseFormRegister<RestRequest>}
      errors={errors}
    />
  );
};

test('renders method select and url input', () => {
  setup();
  expect(screen.getByRole('combobox')).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Enter URL/i)).toBeInTheDocument();
  expect(screen.getAllByRole('option')).toHaveLength(5);
});

test('shows error if url has error', () => {
  const errors: FieldErrors<RestRequest> = {
    url: { type: 'manual', message: 'Invalid URL' },
  };
  setup(errors);
  expect(screen.getByText(/Invalid URL/i)).toBeInTheDocument();
});
