import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/i18n/TranslationProvider'
import Card from './Card'

import partnerCard from '@/assets/artboardHero/partnerCard.png'
import badgeCard from '@/assets/artboardHero/badgeCard.png'


const CardFrame = () => {
  const [activeCard, setActiveCard] = useState<'contribute' | 'collab'>('contribute')
  const router = useRouter()
  const { t } = useTranslation()

  const handleContributeClick = () => {
    router.push('/login')
  }

  const handleCollabClick = () => {
    router.push('/collabs')
  }

  const cards = {
    contribute: {
      title: t('cards.contribute.title') || 'Contribute',
      subtitle: t('cards.contribute.subtitle') || 'Join our community and contribute to exciting projects. Share your skills and make an impact.',
      buttonText: t('cards.contribute.button') || 'Get Started',
      background: badgeCard,
      onClick: handleContributeClick 

    },
    collab: {
      title: t('cards.collab.title') || 'Collaborate',
      subtitle: t('cards.collab.subtitle') || 'Find amazing collaborators and work together on innovative projects.',
      buttonText: t('cards.collab.button') || 'Explore Collabs',
        background: partnerCard,
      onClick: handleCollabClick
    }
  }

  return (
    <div className="flex w-full flex-col items-center space-y-6">
      {/* Frame Container - Horizontal Rectangle */}
      <div className="
        relative w-[90%] max-w-4xl h-60 sm:h-auto sm:aspect-[3/1] md:aspect-[4/1] lg:aspect-[5/1]
        bg-black/20 backdrop-blur-xl rounded-3xl 
        border-2 border-white/30 
        p-1 overflow-hidden
        shadow-2xl shadow-black/50
      ">
        {/* Blur Background Overlay */}
        <div className="
          absolute inset-0 
          bg-gradient-to-br from-white/10 via-transparent to-white/20
          backdrop-blur-sm rounded-3xl
        " />
        
        {/* Card Container */}
        <div className="relative w-full h-full p-2">
          {/* Contribute Card */}
          <div className={`
            absolute inset-2 transition-all duration-500 ease-in-out
            ${activeCard === 'contribute' 
              ? 'opacity-100 translate-x-0 z-10' 
              : 'opacity-0 -translate-x-full z-0'
            }
          `}>
            <Card
              title={cards.contribute.title}
              subtitle={cards.contribute.subtitle}
              buttonText={cards.contribute.buttonText}
              background={cards.contribute.background}
              onButtonClick={cards.contribute.onClick}
            />
          </div>

          {/* Collab Card */}
          <div className={`
            absolute inset-2 transition-all duration-500 ease-in-out
            ${activeCard === 'collab' 
              ? 'opacity-100 translate-x-0 z-10' 
              : 'opacity-0 translate-x-full z-0'
            }
          `}>
            <Card
              title={cards.collab.title}
              subtitle={cards.collab.subtitle}
              buttonText={cards.collab.buttonText}
              background={cards.collab.background}
              onButtonClick={cards.collab.onClick}
            />
          </div>
        </div>
      </div>

      {/* Switch Controls */}
      <div className="flex w-80 p-2 px-12 border border-white/40 rounded-full items-center justify-between">
        <button
          onClick={() => setActiveCard('contribute')}
          className={`
             py-1 w-25 rounded-full font-medium transition-all duration-300
            ${activeCard === 'contribute'
              ? 'bg-white text-gray-900 shadow-lg scale-105'
              : 'bg-transparent text-white hover:bg-white/30'
            }
          `}
        >
          {t('cards.contribute.switch') || 'Student'}
        </button>
        
        
        <button
          onClick={() => setActiveCard('collab')}
          className={`
             py-1 w-25 rounded-full font-medium transition-all duration-300
            ${activeCard === 'collab'
              ? 'bg-white text-gray-900 shadow-lg scale-105'
              : 'bg-transparent text-white hover:bg-white/30'
            }
          `}
        >
          {t('cards.collab.switch') || 'Collaborator'}
        </button>
      </div>
    </div>
  )
}

export default CardFrame
