'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Nav.css';

export default function Nav() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const links = [
    { href: '/client', label: t('nav.restClient') },
    { href: '/history', label: t('nav.history') },
    { href: '/variables', label: t('nav.variables') },
  ];

  return (
    <nav className="nav-links">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`nav-link ${pathname === href ? 'active' : ''}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
