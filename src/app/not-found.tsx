'use client';

import Link from 'next/link';
import './error-pages.css';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="not-found-container">
      <h1 className="not-found-title">{'404'}</h1>
      <h2 className="not-found-subtitle">{t('error.notFound.subtitle')}</h2>
      <p className="not-found-text">{t('error.notFound.text')}</p>
      <Link href="/" className="back-home-button">
        {t('error.notFound.back')}
      </Link>
    </div>
  );
}
