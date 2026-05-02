import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/i18n/TranslationProvider'
import api from '@/app/api/axios'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnimatedValues {
  driveFolders:     number
  contributors:     number
  futureBacheliers: number
}

interface ApiContributor {
  resources?: any[]
  drives?:    any[]
  [key: string]: any
}

// ─── Cache ────────────────────────────────────────────────────────────────────

const CACHE_KEY = 'innumbers_stats_v1'
const CACHE_TTL = 5 * 60 * 1000

const readCache = (): { data: unknown; stale: boolean } | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const entry: { data: unknown; timestamp: number } = JSON.parse(raw)
    return { data: entry.data, stale: Date.now() - entry.timestamp > CACHE_TTL }
  } catch { return null }
}

const writeCache = (data: unknown) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() })) }
  catch { /* quota / SSR */ }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const extractArray = (data: unknown): any[] => {
  if (Array.isArray(data))                              return data
  if (data && Array.isArray((data as any).content))     return (data as any).content
  if (data && Array.isArray((data as any).data))        return (data as any).data
  if (data && Array.isArray((data as any).submissions)) return (data as any).submissions
  return []
}

const deriveStats = (raw: ApiContributor[]): AnimatedValues => ({
  contributors:     raw.length,
  driveFolders:     raw.reduce((sum, c) => sum + ((c.resources ?? c.drives ?? []).length), 0),
  futureBacheliers: 650, // estimated reach — adjust multiplier as needed
})

// ─── Hook ─────────────────────────────────────────────────────────────────────

const useStats = () => {
  const [targets, setTargets] = useState<AnimatedValues>({ driveFolders: 0, contributors: 0, futureBacheliers: 0 })

  useEffect(() => {
    let cancelled = false

    const fetchFresh = async (background: boolean) => {
      try {
        const res  = await api.get('')
        if (cancelled) return
        setTargets(deriveStats(extractArray(res.data)))
        writeCache(res.data)
      } catch {
        // background failures are silent; foreground leaves zeroes
      }
    }

    const cached = readCache()
    if (cached) {
      setTargets(deriveStats(extractArray(cached.data)))
      if (!cached.stale) return
      fetchFresh(true)
      return () => { cancelled = true }
    }

    fetchFresh(false)
    return () => { cancelled = true }
  }, [])

  return targets
}

// ─── Main component ───────────────────────────────────────────────────────────

const InNumbers = () => {
  const { t }    = useTranslation()
  const targets  = useStats()

  const [animated, setAnimated]     = useState<AnimatedValues>({ driveFolders: 0, contributors: 0, futureBacheliers: 0 })
  const [isVisible, setIsVisible]   = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Re-run animation whenever targets change (e.g. after cache miss fetch)
  useEffect(() => {
    if (targets.contributors === 0) return
    setHasAnimated(false)
    if (isVisible) setIsVisible(false) // reset so the effect below re-fires
    // small tick to let state flush
    setTimeout(() => setIsVisible(true), 10)
  }, [targets])

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) setIsVisible(true)
      },
      { threshold: 0.3, rootMargin: '0px 0px -50px 0px' }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current) }
  }, [hasAnimated])

  // Counter animation
  useEffect(() => {
    if (!isVisible || hasAnimated) return

    const duration    = 2000
    const totalFrames = duration / (1000 / 60)

    const keys = Object.keys(targets) as (keyof AnimatedValues)[]

    keys.forEach(key => {
      const target = targets[key]
      let frame = 0

      const animate = () => {
        frame++
        const progress    = Math.min(frame / totalFrames, 1)
        const eased       = 1 - Math.pow(1 - progress, 3)
        const current     = Math.floor(eased * target)

        setAnimated(prev => ({ ...prev, [key]: current }))
        if (progress < 1) requestAnimationFrame(animate)
        else if (key === keys[keys.length - 1]) setHasAnimated(true)
      }

      setTimeout(() => requestAnimationFrame(animate), 200)
    })
  }, [isVisible, hasAnimated, targets])

  const config = [
    { key: 'driveFolders',     label: t('info.driveFolders'),    value: animated.driveFolders,     suffix: ''  },
    { key: 'contributors',     label: t('info.contributors'),    value: animated.contributors,     suffix: ''  },
    { key: 'futureBacheliers', label: t('info.futureBachelier'), value: animated.futureBacheliers, suffix: '+' },
  ]

  return (
    <section ref={sectionRef} className="w-full py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {config.map(stat => (
            <div key={stat.key} className="relative group">
              <div className="relative p-6 md:p-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2 font-mono">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
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