'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useHeaderLogic } from './hooks/useHeaderLogic';
import { Suspense } from 'react';
import './Header.css';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();

  return (
    <header className={`header ${isSticky ? 'is-sticky' : ''}`}>
      <div className="header-container">
        <Link href="/" className="logo-link">
          <Image
            src="/logo-rbr.png"
            alt={t('nav.restClient')}
            width={120}
            height={80}
            className="logo-image"
            priority
          />
        </Link>

        {user && (
          <nav className="nav-menu">
            <Link
              href="/client"
              className={`nav-menu-link ${pathname === '/client' ? 'active' : ''}`}
            >
              {t('nav.restClient')}
            </Link>

            <Link
              href="/history"
              className={`nav-menu-link ${pathname === '/history' ? 'active' : ''}`}
            >
              {t('nav.history')}
            </Link>

            <Link
              href="/variables"
              className={`nav-menu-link ${pathname === '/variables' ? 'active' : ''}`}
            >
              {t('nav.variables')}
            </Link>
          </nav>
        )}

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
