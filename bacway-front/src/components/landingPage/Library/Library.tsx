'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import catSad from '@/assets/catMood/catSad.svg'
import { useTranslation } from '@/i18n/TranslationProvider';

interface Division {
  id: string;
  nameKey: string;
}

const Library = () => {
  const { t, locale } = useTranslation();
  const [selectedDivision, setSelectedDivision] = useState<string | null>('mathematics');

  // BAC Divisions data
  const divisions: Division[] = [
    { id: 'mathematics', nameKey: 'mathematics' },
    { id: 'science', nameKey: 'science' },
    { id: 'technicalMath', nameKey: 'technicalMath' },
    { id: 'management', nameKey: 'management' },
    { id: 'languages', nameKey: 'languages' },
    { id: 'literature', nameKey: 'literature' },
  ];

  const isRTL = locale === 'ar';

  return (
    <div className=' w-full'>
      {/* Header Section */}
      <div className='flex flex-col items-center justify-center py-10 px-0'>
        <Image src="/bacwayLibrary.svg" alt="Bacway Library Logo" width={100} height={100} className=' h-25 md:h-30' />
        <h2 className='text-white text-3xl md:text-5xl mt-2 font-bold'>{t('library.title')}</h2>
        <p className='text-gray-300 text-sm md:text-base text-center max-w-2xl mt-4 px-5'>{t('library.subtitle')}</p>
      </div>

      {/* Two Column Layout */}
      <div className=" m-0 border-y border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 ">


          {/* Left Column - Drive Folders/Resources */}
          <div>
            <div className="h-full flex items-center justify-center">
              {selectedDivision ? (
                // Selected division resources area
                <div className="p-6 ">
                  
                    {/* No contributions placeholder */}
                    {/* Placeholder for the image you'll upload later */}
                    <div className="w-full h-full mb-6 flex items-center justify-center">
                      <Image
                        src={catSad}
                        alt="No Contributions"
                        width={200}
                        height={200}
                        className=" object-contain h-[80%] w-[70%] md:w-[80%] object-center"

                      />
                    </div>
                </div>
              ) : (
                // No division selected state
                <div className="flex flex-col items-center justify-center h-full py-16">
                  <p className={`text-gray-500 text-center ${isRTL ? 'font-arabic' : 'font-outfit'}`}>
                    {isRTL ? 'اختر شعبة لعرض الموارد' : 'Select a division to view resources'}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - BAC Divisions */}
          <div className="py-8 not-md:border-t md:border-l border-white/20 px-5 md:px-10">
            
            <div className="">
              {divisions.map((division) => (
                <div
                  key={division.id}
                  className={`border-b border-white/20 p-4 cursor-pointer transition-all duration-300 hover:bg-gray-800/60
                  `}
                  onClick={() => setSelectedDivision(division.id)}
                >
                  <div className={`flex flex-col gap-3 ${isRTL ? 'font-arabic text-right' : 'font-outfit'}`}>
                    {/* Division Name */}
                    <h4 className={`text-lg font-semibold transition-colors `}>
                      {t(`library.divisions.${division.nameKey}` as any)}
                    </h4>
                    
                    {/* Login for more resources - appears when division is selected */}
                    {selectedDivision === division.id && (
                      <button
                        className={`text-sm mb-1 text-blue-400 hover:text-blue-300 cursor-pointer transition-all duration-200 ${
                          isRTL ? 'text-right font-arabic' : 'text-left font-outfit'
                        }`}
                        onClick={() => {
                          // Redirect to login page
                          window.location.href = '/login';
                        }}
                      >
                        {t('library.loginForMore')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Library