import { render, screen, fireEvent } from '@testing-library/react';
import BodyBlock from '../BodyBlock';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { RestRequest } from '@/types';
import type { FieldError } from 'react-hook-form';

const registerMock = jest.fn(() => ({}));
const handlePrettifyMock = jest.fn();

const setup = (
  watchedBodyType: 'json' | 'text',
  errors: FieldErrors<RestRequest> = {}
) => {
  render(
    <BodyBlock
      register={registerMock as unknown as UseFormRegister<RestRequest>}
      errors={errors}
      watchedBodyType={watchedBodyType}
      handlePrettify={handlePrettifyMock}
    />
  );
};

test('renders default inputs', () => {
  setup('text');
  expect(screen.getByLabelText(/Text/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/JSON/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Request Body/i)).toBeInTheDocument();
  expect(screen.queryByText(/Prettify/i)).not.toBeInTheDocument();
});

test('renders prettify button when bodyType is json', () => {
  setup('json');
  expect(screen.getByText(/Prettify/i)).toBeInTheDocument();
});

test('calls handlePrettify on button click', () => {
  setup('json');
  fireEvent.click(screen.getByText(/Prettify/i));
  expect(handlePrettifyMock).toHaveBeenCalled();
});

test('shows error when body has error', () => {
  const fakeFieldError: FieldError = {
    type: 'manual',
    message: 'Required field',
  };

  setup('text', { body: fakeFieldError });
  expect(screen.getByText(/Required field/i)).toBeInTheDocument();
});
