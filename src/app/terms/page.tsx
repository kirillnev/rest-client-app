'use client';
import { useTranslation } from 'react-i18next';
import './terms.css';

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <main className="terms-main">
      <h1 className="terms-title">{t('terms.title')}</h1>
      <p>{t('terms.lastUpdated')}</p>

      <div className="terms-section">
        <h2>{t('terms.sections.purpose.title')}</h2>
        <p>{t('terms.sections.purpose.text')}</p>
      </div>

      <div className="terms-section">
        <h2>{t('terms.sections.responsibility.title')}</h2>
        <ul>
          {(
            t('terms.sections.responsibility.items', {
              returnObjects: true,
            }) as string[]
          ).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="terms-section">
        <h2>{t('terms.sections.warranty.title')}</h2>
        <p>{t('terms.sections.warranty.text')}</p>
      </div>

      <div className="terms-section">
        <h2>{t('terms.sections.liability.title')}</h2>
        <p>{t('terms.sections.liability.text')}</p>
      </div>

      <div className="terms-section">
        <h2>{t('terms.sections.changes.title')}</h2>
        <p>{t('terms.sections.changes.text')}</p>
      </div>

      <div className="terms-section">
        <h2>{t('terms.sections.contact.title')}</h2>
        <p>{t('terms.sections.contact.text')}</p>
      </div>
    </main>
  );
}
