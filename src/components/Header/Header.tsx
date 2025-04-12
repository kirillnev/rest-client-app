'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useHeaderLogic } from './hooks/useHeaderLogic';
import { Suspense } from 'react';
import './Header.css';

const HeaderContent = () => {
  const { t } = useTranslation();
  const {
    user,
    loading,
    handleSignOut,
    isLangOpen,
    selectedLang,
    languages,
    handleLangSelect,
    toggleLangOpen,
    isSticky,
  } = useHeaderLogic();

  return (
    <header className={`header ${isSticky ? 'is-sticky' : ''}`}>
      <div className="header-container">
        <Link href="/" className="logo-link">
          <Image
            src="/app-logo.png"
            alt={t('nav.restClient')}
            width={80}
            height={80}
            className="logo-image"
            priority
          />
        </Link>

        <div className="button-container">
          <div className="lang-toggle">
            <button className="lang-button" onClick={toggleLangOpen}>
              {t('nav.language')}: {selectedLang.toUpperCase()}{' '}
              <span className="dropdown-arrow">▼</span>
            </button>
            {isLangOpen && (
              <ul className="lang-dropdown">
                {languages.map((lang) => (
                  <li key={lang} className="lang-item">
                    <button
                      className={`lang-option ${lang === selectedLang ? 'selected' : ''}`}
                      onClick={() => handleLangSelect(lang)}
                    >
                      {lang.toUpperCase()}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="auth-section">
            {!loading && user ? (
              <button onClick={handleSignOut} className="auth-button">
                {t('auth.signOut')}
              </button>
            ) : (
              <>
                <Link href="/auth/signin" className="auth-button">
                  {t('auth.signIn')}
                </Link>
                <Link href="/auth/signup" className="auth-button">
                  {t('auth.signUp')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default function Header() {
  return (
    <Suspense fallback={<header className="header" />}>
      <HeaderContent />
    </Suspense>
  );
}
