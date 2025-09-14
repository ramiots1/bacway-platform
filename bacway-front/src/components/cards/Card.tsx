import React from 'react'
import Image from 'next/image'
import { StaticImageData } from 'next/image'
import { useTranslation } from '@/i18n/TranslationProvider';

interface CardProps {
  title: string
  subtitle: string
  buttonText: string
  background: StaticImageData;
  onButtonClick: () => void
  className?: string
}

const Card: React.FC<CardProps> = ({ 
  title, 
  subtitle, 
  buttonText,
  background,
  onButtonClick,
  className = ""
}) => {
  const { locale } = useTranslation();

  return (
    <div className={`
      relative w-full h-full overflow-hidden rounded-2xl 
      transition-all duration-300 ease-in-out
      hover:scale-101 hover:shadow-2xl cursor-pointer
      ${className}
    `}>
      {/* Background Image */}
      <Image
        src={background}
        alt="Card Background"
        fill
        className="absolute inset-0 object-cover transition-transform duration-300 hover:scale-101"
        priority
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full px-5 p-1 sm:p-5 md:p-4 flex flex-col justify-around">
        {/* Text Content - Left Side */}
        <div className={`max-w-[90%] sm:max-w-[70%] md:max-w-[60%] ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
          <h3 className="text-[100%] md:text-xl lg:text-xl font-bold text-white mb-1 md:mb-2 leading-tight transition-all duration-300 hover:text-blue-200">
            {title}
          </h3>
          <p className={`text-[70%] md:my-2 text-white/90 leading-relaxed transition-all duration-300 hover:text-white`}>
            {subtitle}
          </p>
        </div>

        {/* Button - Bottom Left */}
        <div className="flex justify-start">
          <button
            onClick={onButtonClick}
            className="
              px-4 py-1 md:px-6 md:py-1
              border border-white
              bg-transparent
              hover:bg-white hover:text-gray-900
              hover:scale-110 hover:shadow-lg
              text-white font-semibold rounded-full 
              text-[12px]
              transition-all duration-200 ease-in-out
              transform active:scale-95
            "
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card
