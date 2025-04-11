import { render, screen, fireEvent } from '@testing-library/react';
import RequestForm from '../RequestForm';
import type { RestRequest } from '@/types';
import type { UseFormReturn } from 'react-hook-form';
import { FormEventHandler } from 'react';

// eslint-disable-next-line react/display-name
jest.mock('../MethodUrlBlock', () => () => <div>MethodUrlBlock</div>);
// eslint-disable-next-line react/display-name
jest.mock('../HeadersBlock', () => () => <div>HeadersBlock</div>);
// eslint-disable-next-line react/display-name
jest.mock('../BodyBlock', () => () => <div>BodyBlock</div>);

jest.mock('../hooks/useRequestForm', () => ({
  useRequestForm: () => ({
    fields: [],
    append: jest.fn(),
    remove: jest.fn(),
    watchedBodyType: 'text',
    handlePrettify: jest.fn(),
  }),
}));

const formMock = {
  register: jest.fn(),
  formState: { errors: {} },
  handleSubmit:
    (cb: (data: RestRequest) => void): FormEventHandler<HTMLFormElement> =>
    (e) => {
      e.preventDefault();
      cb({} as RestRequest);
    },
} as unknown as UseFormReturn<RestRequest>;

const onSubmitMock = jest.fn(() => Promise.resolve());

const setup = (isLoading = false) => {
  render(
    <RequestForm
      form={formMock}
      onSubmit={onSubmitMock}
      isLoading={isLoading}
    />
  );
};

test('renders all blocks and send button', () => {
  setup();
  expect(screen.getByText(/MethodUrlBlock/i)).toBeInTheDocument();
  expect(screen.getByText(/HeadersBlock/i)).toBeInTheDocument();
  expect(screen.getByText(/BodyBlock/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument();
});

test('disables fieldset when isLoading is true', () => {
  setup(true);
  expect(screen.getByRole('button', { name: /Sending/i })).toBeDisabled();
});

test('calls onSubmit on form submit', () => {
  setup();
  fireEvent.click(screen.getByRole('button', { name: /Send/i }));
  expect(onSubmitMock).toHaveBeenCalled();
});
