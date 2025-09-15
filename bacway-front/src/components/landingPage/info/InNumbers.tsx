import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/i18n/TranslationProvider'
import statisticsData from '@/data/statistics.json'

interface StatisticItem {
  value: number
  increment: number
}

interface Statistics {
  driveFolders: StatisticItem
  contributors: StatisticItem
  teachers: StatisticItem
  futureBacheliers: StatisticItem
}

const InNumbers = () => {
  const { t } = useTranslation()
  const [stats, setStats] = useState<Statistics>(statisticsData.statistics as Statistics)
  const [animatedValues, setAnimatedValues] = useState({
    driveFolders: 0,
    contributors: 0,
    teachers: 0,
    futureBacheliers: 0
  })
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Intersection Observer to detect when component is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the component is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before fully in view
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [hasAnimated])

  // Counter animation effect - only runs when visible
  useEffect(() => {
    if (!isVisible || hasAnimated) return

    const duration = 2000 // 2 seconds
    const frameRate = 60 // 60fps for smooth animation
    const totalFrames = duration / (1000 / frameRate)

    Object.entries(stats).forEach(([key, data]) => {
      const targetValue = data.value
      let frame = 0

      const animate = () => {
        frame++
        const progress = Math.min(frame / totalFrames, 1)
        
        // Easing function for smoother animation (ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3)
        const currentValue = Math.floor(easedProgress * targetValue)

        setAnimatedValues(prev => ({
          ...prev,
          [key]: currentValue
        }))

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // Mark as animated when all animations complete
          setHasAnimated(true)
        }
      }

      // Start animation after a small delay
      setTimeout(() => requestAnimationFrame(animate), 200)
    })
  }, [isVisible, hasAnimated, stats])

  const statisticsConfig = [
    {
      key: 'driveFolders',
      label: t('info.driveFolders'),
      value: animatedValues.driveFolders,
      suffix: '',
    },
    {
      key: 'contributors',
      label: t('info.contributors'),
      value: animatedValues.contributors,
      suffix: '',
    },
    {
      key: 'teachers',
      label: t('info.teachers'),
      value: animatedValues.teachers,
      suffix: '',
    },
    {
      key: 'futureBacheliers',
      label: t('info.futureBachelier'),
      value: animatedValues.futureBacheliers,
      suffix: '+',
    }
  ]

  return (
    <section ref={sectionRef} className="w-full py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {statisticsConfig.map((stat) => (
            <div
              key={stat.key}
              className="relative group"
            >
              
              {/* Card content */}
              <div className="relativep-6 md:p-8">

                {/* Number */}
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold text-white mb-2 font-mono">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>

                  {/* Label */}
                  <div className="text-sm md:text-base text-white font-normal leading-tight">
                    {stat.label}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default InNumbers