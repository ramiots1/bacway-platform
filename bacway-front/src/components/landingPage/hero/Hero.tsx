'use client';

import React from 'react'
import { useTranslation } from '@/i18n/TranslationProvider';

import ArtboardHero from './ArtboardHero';
import LogIn from '@/components/button/LogIn';
import CardFrame from '@/components/cards/CardFrame';
import Image from 'next/image';
import upShadow from '@/assets/artboardHero/upShadow.png'


const Hero = () => {
  const now = new Date();
  const displayYear = now.getMonth() >= 6 ? now.getFullYear() + 1 : now.getFullYear();
  const shortYear = String(displayYear).slice(-2);
  const { t, locale } = useTranslation();

  return (
    <section className="relative w-full h-auto pt-25 flex flex-col items-start justify-center text-center overflow-hidden">
      
      {/* Background Image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-50 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 30%, rgba(0,201,165,0.35), transparent 60%),
                            radial-gradient(circle at 80% 25%, rgba(0,117,201,0.55), transparent 62%),
                            radial-gradient(circle at 55% 70%, rgba(170,36,219,0.5), transparent 70%)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
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

        <div className="w-full mt-30 mb-20 flex flex-col items-center justify-center px-5 md:px-0">
            <CardFrame />
            <p className="text-white/70 mt-10 w-80% md:w-[40%] "> {t('hero.more')} </p>
        </div>
        
      <Image 
        src={upShadow} 
        alt="bacway Background" 
        className="absolute -bottom-[50px] object-cover object-bottom -z-100"
      />
    </section>
  )
}

export default Hero