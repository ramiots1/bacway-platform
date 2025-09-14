'use client';

import React from 'react'
import Image from 'next/image'
import { useTranslation } from '@/i18n/TranslationProvider';

import infoEng from '@/assets/informational/infoEng.svg'
import infoAr from '@/assets/informational/infoAr.svg'

const Info = () => {
  const { t, locale } = useTranslation();

  return (
    <div>
        <div className="flex my-20 flex-col items-center justify-between">
        {locale === 'ar' ? (
            <div className="md:w-[90%] p-4">
            <Image src={infoAr} alt={t('info.arabic')} layout="responsive" />
            </div>
        ) : (
            <div className="md:w-[90%] p-4">
            <Image src={infoEng} alt={t('info.english')} layout="responsive" />
            </div>
        )}</div>

    </div>
  )
}

export default Info