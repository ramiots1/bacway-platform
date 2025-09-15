import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import feedbacksData from '@/data/feedbacks.json'

// Import images
import rayaneKerImg from '@/data/people/rayaneKer.png'
import ramiImg from '@/data/people/rami.png'
import sidAliImg from '@/data/people/sidAli.png'
import riadDoukhaImg from '@/data/people/riadDoukha.png'

interface Feedback {
  id: number
  name: string
  role: string
  initials: string
  image?: string
  testimonial: string
}

// Map image names to imported images
const imageMap: Record<string, any> = {
  'rayaneKer': rayaneKerImg,
  'rami': ramiImg,
  'sidAli': sidAliImg,
  'riadDoukha': riadDoukhaImg,
}

// Load feedback data from JSON
const loadFeedbackData = (): Feedback[] => {
  return feedbacksData.feedbacks as Feedback[]
}

// Detect if text contains Arabic characters
const isArabicText = (text: string): boolean => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/
  return arabicRegex.test(text)
} 

// Get appropriate font class based on text content
const getTestimonialFontClass = (testimonial: string): string => {
  if (isArabicText(testimonial)) {
    return 'font-arabic' // You can replace with your Arabic font class
  }
  return 'font-latin' // You can replace with your Latin font class
}

const AvatarOrImage: React.FC<{ f: Feedback }> = ({ f }) => {
  // Get the imported image based on the image key
  const imageSource = f.image ? imageMap[f.image] : null
  
  if (imageSource) {
    return (
        <div className="w-11 border border-white/30 h-11 md:h-14 md:w-14 rounded-full overflow-hidden bg-black">
          <Image 
            src={imageSource} 
            alt={f.name} 
            width={56} 
            height={56} 
            className="object-cover"
          />
        </div>
    )
  }
  return (
      <div className="w-11 border border-white/30 h-11 md:h-14 md:w-14 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-gray-800 to-gray-900">
        {f.initials}
      </div>
  )
}

const Card: React.FC<{ f: Feedback }> = ({ f }) => {
  const testimonialFontClass = getTestimonialFontClass(f.testimonial)
  const isArabic = isArabicText(f.testimonial)
  
  return (
    <article className="flex-none w-70 md:w-96 group border-l border-b border-white/30">
      <div className="relative overflow-hidden h-60 md:h-72 p-[1px]">
        <div className="w-full h-full overflow-hidden">

          <div className="relative z-10 p-6 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <AvatarOrImage f={f} />
              <div className="flex-1 min-w-0">
                {/* Names and roles keep consistent font regardless of language switching */}
                <h3 className="text-white font-bold text-[13px] md:text-base truncate group-hover:text-gray-300 transition-colors duration-300 font-sans">{f.name}</h3>
                <p className="text-gray-400 text-[12px] md:text-sm font-medium truncate font-sans">{f.role}</p>
              </div>
            </div>

            <div className="flex-1 relative">
              {/* Apply language-specific font and direction only to testimonial */}
              <p className={`text-gray-200 text-[11px] md:text-sm leading-relaxed md:pt-2 line-clamp-8 ${testimonialFontClass} ${isArabic ? 'text-right' : 'text-left'}`}>
                {f.testimonial}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

const ScrollingTrack: React.FC<{ items: Feedback[]; duration: number; reverse?: boolean }> = ({ items, duration, reverse }) => {
  // Enhanced marquee: seamless infinite scroll with proper spacing
  return (
    <div className="overflow-hidden">
      <div
        className={`flex marquee ${reverse ? 'marquee-reverse' : 'marquee-forward'}`}
        style={{ ['--duration' as any]: `${duration}s` } as React.CSSProperties}
      >
        {/* Render items twice for seamless loop */}
        {items.map((f) => (
          <Card key={`first-${f.id}`} f={f} />
        ))}
        {items.map((f) => (
          <Card key={`second-${f.id}`} f={f} />
        ))}
      </div>

      <style jsx>{`
        .marquee { 
          align-items: center;
          width: fit-content;
        }
        @keyframes marquee-left { 
          0% { transform: translateX(0); } 
          100% { transform: translateX(-50%); } 
        }
        @keyframes marquee-right { 
          0% { transform: translateX(-50%); } 
          100% { transform: translateX(0); } 
        }
        .marquee-forward { 
          animation: marquee-left var(--duration, 30s) linear infinite; 
          will-change: transform; 
        }
        .marquee-reverse { 
          animation: marquee-right var(--duration, 30s) linear infinite; 
          will-change: transform; 
        }
        .marquee-forward:hover, .marquee-reverse:hover { 
          animation-play-state: paused; 
        }
      `}</style>
    </div>
  )
}

const Feedbacks: React.FC = () => {
  const [items, setItems] = useState<Feedback[]>([])

  useEffect(() => {
    const feedbacks = loadFeedbackData()
    setItems(feedbacks)
  }, [])

  if (!items.length) return null

  return (
    <section className="w-full">

      {/* two rows: top scrolls left, bottom scrolls right */}
      <div className="relative border-t border-white/20">
        {/* subtle edge fades */}
        <div className="absolute left-0 top-0 w-28 h-full bg-gradient-to-r from-[#0B0F11] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-28 h-full bg-gradient-to-l from-[#0B0F11] to-transparent z-10 pointer-events-none" />

        <ScrollingTrack items={items} duration={25} />
        <ScrollingTrack items={items} duration={35} reverse />
      </div>
    </section>
  )
}

export default Feedbacks