"use client";

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from '@/i18n/TranslationProvider';
    
const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#171717] text-white z-100 ">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top: logo + tagline */}
        <div className="flex flex-col items-start md:flex-row md:justify-between gap-3 md:gap-0">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Bacway home" className="inline-flex items-center">
              <Image src="/bacwayLogoWhite.svg" alt="Bacway" width={80} height={20} className="h-5 w-auto" />
            </Link>
            <div className="text-sm text-gray-300 hidden md:block"><span suppressHydrationWarning>{t('footer.madeWith')}</span></div>
          </div>

          <div className="text-sm text-gray-300 md:hidden"><span suppressHydrationWarning>{t('footer.madeWith')}</span></div>
          <div className="hidden md:block">
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-3"><span suppressHydrationWarning>{t('footer.general')}</span></h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors"><span suppressHydrationWarning>{t('footer.home')}</span></Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors"><span suppressHydrationWarning>{t('footer.about')}</span></Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors"><span suppressHydrationWarning>{t('footer.terms')}</span></Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3"><span suppressHydrationWarning>{t('footer.collaboration')}</span></h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/collabs" className="hover:text-white transition-colors"><span suppressHydrationWarning>{t('footer.collab')}</span></Link>
              </li>
              <li>
                <span className="text-sm text-gray-400">Looking to collaborate? Reach out and we&apos;ll connect.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3"><span suppressHydrationWarning>{t('footer.contact')}</span></h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><span suppressHydrationWarning>{t('footer.instagram')}</span></a>
              </li>
              <li>
                <a href="mailto:contact@bacway.dz" className="hover:text-white transition-colors"><span suppressHydrationWarning>{t('footer.email')}</span></a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 text-center text-xs text-gray-500">
          <span suppressHydrationWarning>{t('footer.copyright', { year })}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
