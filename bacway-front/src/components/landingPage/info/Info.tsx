'use client';

import React from 'react'
import Image from 'next/image'
import { useTranslation } from '@/i18n/TranslationProvider';

import infoEng from '@/assets/informational/infoEng.svg'
import infoAr from '@/assets/informational/infoAr.svg'
import upShadow from '@/assets/artboardHero/upShadow.png'
import upShadowColorful from '@/assets/artboardHero/upShadowColorful.png'

import Feedbacks from './Feedbacks';
import InNumbers from './InNumbers';
import InviteContributors from './InviteContributors';

const Info = () => {
  const { t, locale } = useTranslation();

  return (
    <div className=' w-full flex flex-col items-center'>
        <div className="flex max-w-4xl my-20 not-md:mb-15 flex-col items-center justify-between z-10">
        {locale === 'ar' ? (
            <div className="md:w-[90%] p-4">
              <Image
                src={infoAr}
                alt={t('info.arabic')}
                className="w-full h-auto"
                priority
              />
            </div>
        ) : (
            <div className="md:w-[90%] p-4">
              <Image
                src={infoEng}
                alt={t('info.english')}
                className="w-full h-auto"
                priority
              />
            </div>
        )}</div>

        <div className=' w-full h-25 relative overflow-visible'>
          <div className=" absolute flex flex-col text-left w-full px-5 md:px-15 z-1">
            <h2 className="text-white text-2xl md:text-3xl font-bold">{t('info.lovedTitle')}</h2>
            <h3 className="text-gray-300 text-lg md:text-xl max-w-2xl mt-1">{t('info.lovedSubtitle')}</h3>
          </div>
          <div className='absolute inset-0 -z-0'>
            <Image
              src={upShadow}
              alt="Bacway Shadow Decoration"
              fill
              priority={false}
              className='object-cover object-bottom opacity-50 overflow-visible'
            />
          </div>
        </div>

        <div className=' w-full relative' >
          <div className='relative z-10'>
          <Feedbacks />
          <InNumbers />
          <InviteContributors />
          </div>

          <div className='absolute inset-0 -z-0 pointer-events-none'>
            <Image
              src={upShadowColorful}
              alt="Bacway Shadow Decoration"
              fill
              className='object-contain object-bottom opacity-50'
              priority={false}
            />
          </div>

        </div>

    </div>
  )
}

export default Info