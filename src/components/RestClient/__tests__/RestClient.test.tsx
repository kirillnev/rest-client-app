import { render, screen } from '@testing-library/react';
import RestClient from '../RestClient';

jest.mock('../hooks/useRestClient', () => ({
  useRestClient: () => ({
    form: {
      watch: () => ({
        method: 'GET',
        url: '',
        headers: [],
        body: '',
        bodyType: 'text',
      }),
    },
    isLoading: false,
    error: null,
    responseStatus: null,
    responseData: null,
    onSubmit: jest.fn(),
  }),
}));

// eslint-disable-next-line react/display-name
jest.mock('@/components/RequestForm', () => () => <div>RequestForm</div>);
// eslint-disable-next-line react/display-name
jest.mock('@/components/GeneratedCode', () => () => <div>GeneratedCode</div>);
// eslint-disable-next-line react/display-name
jest.mock('@/components/ResponseBlock', () => () => <div>ResponseBlock</div>);

test('renders RestClient without error and response', () => {
  render(<RestClient />);
  expect(screen.getByText('RequestForm')).toBeInTheDocument();
  expect(screen.getByText('GeneratedCode')).toBeInTheDocument();
});
