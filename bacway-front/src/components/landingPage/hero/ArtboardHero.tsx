import React from 'react'
import Image from 'next/image'
import CatAnimation from './CatAnimation'

// Import SVG assets
import cloudA from '@/assets/artboardHero/cloud1.svg'
import cloudB from '@/assets/artboardHero/cloud2.svg'
import { useTranslation} from '@/i18n/TranslationProvider';

const ArtboardHero = () => {

    const { locale } = useTranslation();

  return (
    <div className="w-full h-full overflow-y-visible overflow-x-clip -z-10 pointer-events-none select-none">
      {/* Background */}

      {/* Cat */}
      <div className={`absolute w-full md:h-[600px] h-[400px] overflow-visible top-[calc(250px)] ${locale === 'ar' ? '-left-[5%] md:left-25' : '-left-[10%] md:left-25'} md:top-10 z-30`}>
        <CatAnimation />
      </div>
      
      
      
      {/* Cloud A */}
      <Image 
        src={cloudA} 
        alt="bacway Cloud A" 
        width={200}
        height={100}
        className="absolute -top-20 md:-top-40 -right-50 w-200 h-auto z-20"
      />
      
      {/* Cloud B */}
      <Image 
        src={cloudB} 
        alt="bacway Cloud B" 
        width={200}
        height={100}
        className="absolute -bottom-30 md-bottom-20 -left-50 w-200 h-auto z-40"
      />
    </div>
  )
}

export default ArtboardHero