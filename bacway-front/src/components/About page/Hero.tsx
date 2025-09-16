'use client';

import React from 'react'
import { useTranslation } from '@/i18n/TranslationProvider'
import Image from 'next/image'
import algeriaBacway from '@/assets/artboardHero/algeriaBacway.svg'
import version from '@/assets/version.svg'

const Hero = () => {
  const { t, locale } = useTranslation();

  return (
    <section className="relative w-full h-auto pt-20 lg:pt-15 overflow-hidden">
      {/* Gradient Background Layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 30%, rgba(0,201,165,0.35), transparent 60%),
                            radial-gradient(circle at 80% 25%, rgba(0,117,201,0.55), transparent 62%),
                            radial-gradient(circle at 55% 70%, rgba(170,36,219,0.5), transparent 70%)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-0 py-10 md:py-10 lg:py-0">
        <div className={`flex flex-col lg:flex-row items-center lg:items-center  gap-1 lg:gap-0`}>
          {/* Image: desktop left, mobile below text using order classes */}
          <div className="w-full lg:w-150 order-2 lg:order-1 flex justify-center lg:justify-start ">
            <Image
              src={algeriaBacway}
              alt="Algeria Bacway illustration"
              placeholder="empty"
              className="w-full h-auto max-w-md md:max-w-lg pointer-events-none select-none"
              priority
            />
          </div>

          {/* Text Content */}
          <div
            className={`w-full flex flex-col justify-center lg:w-2/3 order-1 md:pt-15 md:px-20 lg:py-0 lg:px-10 lg:order-2 ${locale === 'ar' ? 'text-right' : 'text-left'}`}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          >
            <h1
              suppressHydrationWarning
              className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight"
            >
              {t('about.title')}
            </h1>
            <p
              suppressHydrationWarning
              className="mt-5 text-lg md:text-xl text-white/85 leading-relaxed font-light"
            >
              {t('about.subtitle')}
            </p>
            <p className="mt-8 text-gray-300 gap-3 flex">
                <Image
                    src={version}
                    alt="bacway Version illustration"
                    placeholder="empty"
                    className="w-auto h-5 inline-block align-middle mr-2 pointer-events-none select-none"
                    priority
                />
                {t('about.version')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero