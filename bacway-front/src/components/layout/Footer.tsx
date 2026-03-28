"use client";

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from '@/i18n/TranslationProvider';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FooterLink {
  href: string;
  labelKey: string;
  external?: boolean;
}

interface FooterSection {
  titleKey: string;
  links: FooterLink[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FOOTER_SECTIONS: FooterSection[] = [
  {
    titleKey: 'footer.general',
    links: [
      { href: '/',        labelKey: 'nav.home'    },
      { href: '/about',    labelKey: 'nav.about'},
      { href: '/library', labelKey: 'nav.library' },
    ],
  },
  {
    titleKey: 'footer.collab',
    links: [
      { href: '/contribute',      labelKey: 'nav.contribute'    },
    ],
  },
  {
    titleKey: 'footer.contact',
    links: [
      { href: 'https://instagram.com/bacway.app', labelKey: 'footer.instagram', external: true },
      { href: 'mailto:bacwaydz@gmail.com',        labelKey: 'footer.email',     external: true },
    ],
  },
];


// ─── Sub-components ───────────────────────────────────────────────────────────

const LinkItem: React.FC<FooterLink & { t: (key: string) => string }> = ({ href, labelKey, external, t }) => {
  const className = "text-sm text-gray-400 hover:text-white transition-colors duration-200"
  const content = <span suppressHydrationWarning>{t(labelKey)}</span>

  if (external) {
    return <a href={href} target="_blank" rel="noreferrer" className={className}>{content}</a>
  }
  return <Link href={href} className={className}>{content}</Link>
}

// ─── Main Component ───────────────────────────────────────────────────────────

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#171717] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── Top: logo + tagline ── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <Link href="/" aria-label="Bacway home">
            <Image src="/bacwayLogoWhite.svg" alt="Bacway" width={80} height={20} className="h-5 w-auto" />
          </Link>
          <p className="text-sm text-gray-400">
            <span suppressHydrationWarning>{t('footer.madeWith')}</span>
          </p>
        </div>

        {/* ── Link grid ── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {FOOTER_SECTIONS.map(({ titleKey, links }) => (
            <div key={titleKey}>
              <h3 className="text-white font-semibold mb-3 text-s tracking-wider">
                <span suppressHydrationWarning>{t(titleKey)}</span>
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <LinkItem {...link} t={t} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom: copyright ── */}
        <div className="mt-10 pt-6 text-center text-s text-gray-400">
          <span suppressHydrationWarning>{t('footer.copyright', { year })}</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;