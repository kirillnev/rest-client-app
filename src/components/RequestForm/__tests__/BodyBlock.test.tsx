import { render, screen, fireEvent } from '@testing-library/react';
import BodyBlock from '../BodyBlock';
import type { FieldErrors, UseFormRegister, FieldError } from 'react-hook-form';
import type { RestRequest } from '@/types';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        'request.body.type.text': 'Text',
        'request.body.type.json': 'JSON',
        'request.body.prettify': 'Prettify',
        'request.body.placeholder': 'Request Body',
      };
      return map[key] || key;
    },
  }),
}));

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

describe('BodyBlock', () => {
  test('renders default inputs', () => {
    setup('text');
    expect(screen.getByLabelText('Text')).toBeInTheDocument();
    expect(screen.getByLabelText('JSON')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Request Body')).toBeInTheDocument();
    expect(screen.queryByText('Prettify')).not.toBeInTheDocument();
  });

  test('renders prettify button when bodyType is json', () => {
    setup('json');
    expect(screen.getByText('Prettify')).toBeInTheDocument();
  });

  test('calls handlePrettify on button click', () => {
    setup('json');
    fireEvent.click(screen.getByText('Prettify'));
    expect(handlePrettifyMock).toHaveBeenCalled();
  });

  test('shows error when body has error', () => {
    const fakeFieldError: FieldError = {
      type: 'manual',
      message: 'Required field',
    };

    setup('text', { body: fakeFieldError });
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });
});
