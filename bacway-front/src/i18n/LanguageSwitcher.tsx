"use client";

import React from 'react';
import { useTranslation } from './TranslationProvider';

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useTranslation();
  return (
    <button
      suppressHydrationWarning
      className="inline-flex items-center gap-2 px-2 py-2 rounded-full bg-transparent text-white hover:bg-white/20 transition-colors"
      onClick={() => {
        const newLocale = locale === 'en' ? 'ar' : 'en';
        document.cookie = `bacway_locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
        setLocale(newLocale);
      }}
      title={`Switch to ${locale === 'en' ? 'Arabic' : 'English'}`}
    >
      {/* Translation/Globe icon */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-4.5 md:w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    </button>
  );
};

export default LanguageSwitcher;
