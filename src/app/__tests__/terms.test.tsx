import { render, screen } from '@testing-library/react';
import TermsPage from '@/app/terms/page';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (
      key: string,
      options?: { returnObjects?: boolean }
    ): string | string[] => {
      const translations: Record<string, string | string[]> = {
        'terms.title': 'Terms and Conditions',
        'terms.lastUpdated': 'Last updated: April 15, 2025',
        'terms.sections.purpose.title': '1. Purpose',
        'terms.sections.purpose.text':
          'This application is intended for testing and learning how REST APIs work.',
        'terms.sections.responsibility.title': '2. User Responsibility',
        'terms.sections.responsibility.items': [
          'You are responsible for all activities performed through your account.',
          'You agree not to misuse the app.',
          'Data you send is not stored or monitored.',
        ],
        'terms.sections.warranty.title': '3. No Warranty',
        'terms.sections.warranty.text': 'This app is provided as is.',
        'terms.sections.liability.title': '4. Limitation of Liability',
        'terms.sections.liability.text': 'We are not liable for damages.',
        'terms.sections.changes.title': '5. Changes',
        'terms.sections.changes.text': 'Terms may be updated.',
        'terms.sections.contact.title': '6. Contact',
        'terms.sections.contact.text': 'Contact the team via GitHub.',
      };

      if (
        key === 'terms.sections.responsibility.items' &&
        options?.returnObjects
      )
        return translations[key];

      return translations[key] as string;
    },
  }),
}));

describe('TermsPage', () => {
  it('renders all section titles and text', () => {
    render(<TermsPage />);

    expect(
      screen.getByRole('heading', { name: 'Terms and Conditions' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Last updated: April 15, 2025')
    ).toBeInTheDocument();

    expect(screen.getByText('1. Purpose')).toBeInTheDocument();
    expect(
      screen.getByText(
        'This application is intended for testing and learning how REST APIs work.'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('2. User Responsibility')).toBeInTheDocument();
    expect(
      screen.getByText(
        'You are responsible for all activities performed through your account.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('You agree not to misuse the app.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Data you send is not stored or monitored.')
    ).toBeInTheDocument();

    expect(screen.getByText('3. No Warranty')).toBeInTheDocument();
    expect(screen.getByText('This app is provided as is.')).toBeInTheDocument();

    expect(screen.getByText('4. Limitation of Liability')).toBeInTheDocument();
    expect(
      screen.getByText('We are not liable for damages.')
    ).toBeInTheDocument();

    expect(screen.getByText('5. Changes')).toBeInTheDocument();
    expect(screen.getByText('Terms may be updated.')).toBeInTheDocument();

    expect(screen.getByText('6. Contact')).toBeInTheDocument();
    expect(
      screen.getByText('Contact the team via GitHub.')
    ).toBeInTheDocument();
  });
});
