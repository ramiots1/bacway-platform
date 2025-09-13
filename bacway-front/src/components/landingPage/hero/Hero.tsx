'use client';

import React from 'react'
import { useTranslation } from '@/i18n/TranslationProvider';

import ArtboardHero from './ArtboardHero';
import LogIn from '@/components/button/LogIn';
import CardFrame from '@/components/cards/CardFrame';
import Image from 'next/image';
import background from '@/assets/artboardHero/bg.svg'


const Hero = () => {
  const now = new Date();
  const displayYear = now.getMonth() >= 6 ? now.getFullYear() + 1 : now.getFullYear();
  const shortYear = String(displayYear).slice(-2);
  const { t, locale } = useTranslation();

  return (
    <section className="relative w-full h-auto pt-25 flex flex-col items-start justify-center text-center overflow-hidden">
      
      {/* Background Image */}
      <Image 
        src={background} 
        alt="bacway Background" 
        fill
        className="absolute top-0 left-0 object-cover object-top -z-100"
        priority
      />

        <div className="w-full h-180 top-0 left-0 -z-50  pointer-events-none select-none absolute">
            <ArtboardHero />
        </div>
        

        <div className={`flex flex-col w-100% mt-10 mx-5 md:mx-20 max-w-100% md:max-w-2xl whitespace-pre-line ${locale === 'ar' ? 'text-right' : 'text-left'}`}  dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <h1 suppressHydrationWarning className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {t('hero.title')}<span className="text-neutral-400">{t('hero.year', { year: shortYear })}</span>
            </h1>
            <p suppressHydrationWarning className="mt-4 text-2xl md:text-2xl text-white/90">
            {t('hero.subtitle', { year: shortYear })}
            </p>
            <br />
            <br />
            <LogIn />
            <br />
            <p suppressHydrationWarning className="mt-4 text-lg md:text-lg text-gray-300">
            {t('hero.subinfo')}
            </p>
        </div>

        <div className="w-full mt-20 mb-10 flex justify-center px-5 md:px-0">
            <CardFrame />
        </div>
        

    </section>
  )
}

export default Hero