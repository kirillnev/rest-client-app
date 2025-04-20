import { render, screen } from '@testing-library/react';
import ResponseBlock from '../ResponseBlock';

test('renders textarea with status and data', () => {
  render(<ResponseBlock status={200} data={{ message: 'ok' }} />);
  expect(screen.getByRole('textbox')).toBeInTheDocument();
});
