import { render, screen, fireEvent } from '@testing-library/react';
import GeneratedCode from '../GeneratedCode';
import { useGeneratedCode } from '../hooks/useGeneratedCode';
import { RestRequest } from '@/types';

jest.mock('../hooks/useGeneratedCode');

const mockUseGeneratedCode = useGeneratedCode as jest.MockedFunction<
  typeof useGeneratedCode
>;

const request: RestRequest = {
  method: 'GET',
  url: 'https://example.com',
  headers: [],
  body: '',
  bodyType: 'json',
};

const fullLanguages = [
  'curl',
  'javascript-fetch',
  'javascript-xhr',
  'nodejs',
  'python',
  'java',
  'csharp',
  'go',
] as const;

test('renders select and textarea', () => {
  mockUseGeneratedCode.mockReturnValue({
    language: 'curl',
    setLanguage: jest.fn(),
    code: 'test-code',
    languages: fullLanguages,
  });

  render(<GeneratedCode request={request} />);

  expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
  expect(screen.getByDisplayValue('test-code')).toBeInTheDocument();
});

test('calls setLanguage on change', () => {
  const setLanguage = jest.fn();

  mockUseGeneratedCode.mockReturnValue({
    language: 'curl',
    setLanguage,
    code: '',
    languages: fullLanguages,
  });

  render(<GeneratedCode request={request} />);

  fireEvent.change(screen.getByLabelText(/language/i), {
    target: { value: 'nodejs' },
  });

  expect(setLanguage).toHaveBeenCalledWith('nodejs');
});
