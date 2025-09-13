"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import en from './en.json';
import ar from './ar.json';

type Locale = 'en' | 'ar';
type TranslationRecord = Record<string, unknown>;

const resources: Record<Locale, TranslationRecord> = { en, ar };

const TranslationContext = createContext({
  t: (key: string, vars?: Record<string, string | number>) => key,
  locale: 'en' as Locale,
  setLocale: (_l: Locale) => {}
});

export const useTranslation = () => useContext(TranslationContext);

const STORAGE_KEY = 'bacway_locale';

export const TranslationProvider: React.FC<{ children: React.ReactNode; initialLocale?: Locale }> = ({ children, initialLocale }) => {
  // initialLocale can be provided from the server to ensure SSR matches client
  const initial = initialLocale ?? ((): Locale => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (saved === 'ar' || saved === 'en') return saved as Locale;
    } catch {
      // ignore
    }
    return 'en';
  })();

  const [locale, setLocaleState] = useState<Locale>(initial);
  const [dict, setDict] = useState(resources[initial]);

  useEffect(() => {
    setDict(resources[locale]);
  }, [locale]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      // set lang so :lang(ar) CSS rules apply (fonts, punctuation fixes)
      document.documentElement.lang = locale === 'ar' ? 'ar' : 'en';
      // Do NOT set document.dir globally — some layouts use flex/positioning that will be
      // mirrored automatically. If you want RTL-only text, we'll apply CSS per-component.
    }
  }, [locale]);

  const setLocale = (l: Locale) => {
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch (e) {
      // ignore
    }
    setLocaleState(l);
  };

  const t = (key: string, vars?: Record<string, any>) => {
    const parts = key.split('.');
    let cur: any = dict;
    for (const p of parts) {
      cur = cur?.[p];
      if (cur === undefined) return key;
    }
    let str = cur as string;
    if (vars) {
      Object.keys(vars).forEach(k => {
        str = str.replace(new RegExp(`{${k}}`, 'g'), String(vars[k]));
      });
    }
    return str;
  };

  return (
    <TranslationContext.Provider value={{ t, locale, setLocale }}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationProvider;
