import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from '@/i18n/TranslationProvider';

import FacebookIcon  from '@/assets/socialmedia/Facebook.svg'
import InstagramIcon from '@/assets/socialmedia/Instagram.svg'
import LinkedinIcon  from '@/assets/socialmedia/Linkedin.svg'
import EmailIcon     from '@/assets/socialmedia/Gmail.svg'

interface Contact {
  instagram?: string
  linkedin?:  string
  facebook?:  string
  email?:     string
}

interface Feedback {
  id:          number | string
  name:        string
  role:        string
  bacyear:     string
  bacdivision: string
  grade:       string
  initials:    string
  imageUrl?:   string
  letter:      string
  contact:     Contact
}

interface ApiContributor {
  id:              string
  fullName?:       string
  full_name?:      string
  bacYear?:        number
  bac_year?:       number
  bacSpeciality?:  string
  bac_speciality?: string
  speciality?:     string
  grade?:          number | string | null
  pictureLink?:    string
  picture_link?:   string
  letter?:         string | null
  contacts?:       Array<{ type: string; contact: string }>
  role?:           string
}

const CACHE_KEY = 'feedbacks_contributors_v1'
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
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() })) } catch {}
}

const isArabic = (text: string) => /[\u0600-\u06FF\u0750-\u077F]/.test(text)

const getInitials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')

const contactTypeMap: Record<string, keyof Contact> = {
  INSTAGRAM: 'instagram',
  LINKEDIN:  'linkedin',
  FACEBOOK:  'facebook',
  EMAIL:     'email',
  GMAIL:     'email',
}

const SPECIALITY_MAP: Record<string, string> = {
  MATHS:          'mathematics',
  MATHEMATICS:    'mathematics',
  SCIENCE:        'science',
  MATH_TECH:      'technicalMath',
  TECHNICAL_MATH: 'technicalMath',
  GESTION:        'management',
  MANAGEMENT:     'management',
  LANGUES:        'languages',
  LANGUAGES:      'languages',
  LETTRE:         'literature',
  LITERATURE:     'literature',
}

const toDivision = (s: string): string =>
  SPECIALITY_MAP[s?.toUpperCase?.().replace(/[\s-]+/g, '_') ?? ''] ?? ''

const extractArray = (data: unknown): any[] => {
  if (Array.isArray(data))                              return data
  if (data && Array.isArray((data as any).content))     return (data as any).content
  if (data && Array.isArray((data as any).data))        return (data as any).data
  if (data && Array.isArray((data as any).submissions)) return (data as any).submissions
  return []
}

const normalize = (raw: ApiContributor[]): Feedback[] =>
  raw
    .filter(c => c.letter)
    .map(c => {
      const fullName    = c.fullName ?? c.full_name ?? 'Unknown'
      const bacYear     = c.bacYear  ?? c.bac_year  ?? 0
      const speciality  = c.bacSpeciality ?? c.bac_speciality ?? c.speciality ?? ''
      const grade       = c.grade != null ? String(c.grade) : ''
      const pictureLink = c.pictureLink ?? c.picture_link ?? undefined
      const contact: Contact = {}
      ;(c.contacts ?? []).forEach(({ type, contact: value }) => {
        const key = contactTypeMap[type?.toUpperCase?.()]
        if (key && value) contact[key] = value
      })
      return {
        id:          c.id,
        name:        fullName,
        role:        c.role ?? 'contributor',
        bacyear:     String(bacYear),
        bacdivision: toDivision(speciality),
        grade,
        initials:    getInitials(fullName),
        imageUrl:    pictureLink,
        letter:      c.letter ?? '',
        contact,
      }
    })

const useFeedbacks = () => {
  const [items, setItems] = useState<Feedback[]>([])

  useEffect(() => {
    let cancelled = false
    const fetchFresh = async (background: boolean) => {
      try {
        const res  = await fetch(process.env.NEXT_PUBLIC_API_URL!)
        const json = await res.json()
        if (cancelled) return
        setItems(normalize(extractArray(json)))
        writeCache(json)
      } catch {
        if (!background && !cancelled) setItems([])
      }
    }
    const cached = readCache()
    if (cached) {
      setItems(normalize(extractArray(cached.data)))
      if (!cached.stale) return
      fetchFresh(true)
      return () => { cancelled = true }
    }
    fetchFresh(false)
    return () => { cancelled = true }
  }, [])

  return items
}

const Avatar: React.FC<{ f: Feedback }> = ({ f }) =>
  f.imageUrl ? (
    <div className="w-11 h-11 md:w-14 md:h-14 rounded-full overflow-hidden border border-white/20 shrink-0">
      <img src={f.imageUrl} alt={f.name} className="object-cover w-full h-full" />
    </div>
  ) : (
    <div className="w-11 h-11 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-gray-800 to-gray-900 shrink-0">
      {f.initials}
    </div>
  )

const SocialLinks: React.FC<{ contact: Contact }> = ({ contact }) => {
  const links = [
    { href: contact.instagram,                                      icon: InstagramIcon, label: 'Instagram' },
    { href: contact.linkedin,                                       icon: LinkedinIcon,  label: 'LinkedIn'  },
    { href: contact.facebook,                                       icon: FacebookIcon,  label: 'Facebook'  },
    { href: contact.email ? `mailto:${contact.email}` : undefined, icon: EmailIcon,     label: 'Email'     },
  ].filter((l): l is typeof l & { href: string } => !!l.href)

  if (!links.length) return null

  return (
    <div className="flex items-center gap-5 mt-3 shrink-0">
      {links.map(({ href, icon, label }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-6 h-6 opacity-60 hover:opacity-100 transition-opacity duration-200" onClick={e => e.stopPropagation()}>
          <img src={icon.src ?? icon} alt={label} className="w-full h-full" />
        </a>
      ))}
    </div>
  )
}

const Card: React.FC<{ f: Feedback }> = ({ f }) => {
  const { t }  = useTranslation()
  const arabic = isArabic(f.letter)

  return (
    <article className="flex-none w-72 md:w-96 border-l border-b border-white/20">
      <div className="p-5 md:p-6 h-88 md:h-100 flex flex-col gap-4">

        <div className="flex items-start gap-3 shrink-0">
          <Avatar f={f} />
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm md:text-base truncate font-sans leading-tight">{f.name}</h3>
            <p className="text-gray-400 text-xs md:text-sm truncate font-sans">
              {t(`contributorDiscription.roles.${f.role}`, { defaultValue: f.role })}
            </p>
            <p className="text-gray-400 text-[11px] md:text-xs font-sans mt-0.5">
              Bac {f.bacyear}{f.grade ? ` · ${f.grade}` : ''}{f.bacdivision ? ` · ${t(`library.divisions.${f.bacdivision}`, { defaultValue: f.bacdivision })}` : ''}
            </p>
          </div>
        </div>

        {/* Letter — scrollable vertically, long words break */}
        <div
          className="flex-1 min-h-0 overflow-y-auto"
          style={{ scrollbarWidth: 'none' }}
          onMouseDown={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
        >
          <p
            className={`text-gray-300 text-[11px] md:text-sm leading-relaxed font-sans ${arabic ? 'text-right' : 'text-left'}`}
            dir={arabic ? 'rtl' : 'ltr'}
            style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
          >
            {f.letter}
          </p>
        </div>

        <SocialLinks contact={f.contact} />
      </div>
    </article>
  )
}

// ─── Drag-only horizontal track ───────────────────────────────────────────────

const ScrollingTrack: React.FC<{ items: Feedback[] }> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging   = useRef(false)
  const startX       = useRef(0)
  const scrollLeft   = useRef(0)

  const onMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current
    if (!el) return
    isDragging.current = true
    startX.current     = e.pageX - el.offsetLeft
    scrollLeft.current = el.scrollLeft
    el.style.cursor    = 'grabbing'
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const el = containerRef.current
    if (!el) return
    e.preventDefault()
    const x    = e.pageX - el.offsetLeft
    const walk = (x - startX.current) * 1.2
    el.scrollLeft = scrollLeft.current - walk
  }

  const onMouseUp = () => {
    isDragging.current = false
    if (containerRef.current) containerRef.current.style.cursor = 'grab'
  }

  const onTouchStart = (e: React.TouchEvent) => {
    const el = containerRef.current
    if (!el) return
    isDragging.current = true
    startX.current     = e.touches[0].pageX - el.offsetLeft
    scrollLeft.current = el.scrollLeft
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    const el = containerRef.current
    if (!el) return
    const x    = e.touches[0].pageX - el.offsetLeft
    const walk = (x - startX.current) * 1.2
    el.scrollLeft = scrollLeft.current - walk
  }

  const onTouchEnd = () => { isDragging.current = false }

  return (
    <div
      ref={containerRef}
      className="flex overflow-x-scroll cursor-grab select-none"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* webkit scrollbar hide */}
      <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
      {items.map((f, i) => (
        <Card key={`${f.id}-${i}`} f={f} />
      ))}
    </div>
  )
}

const Feedbacks: React.FC = () => {
  const items = useFeedbacks()
  if (!items.length) return null

  return (
    <section className="w-full">
      <div className="relative border-t border-white/20">
        <div className="absolute left-0 top-0 w-28 h-full bg-gradient-to-r from-[#0B0F11] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-28 h-full bg-gradient-to-l from-[#0B0F11] to-transparent z-10 pointer-events-none" />
        <ScrollingTrack items={items} />
      </div>
    </section>
  )
}

export default Feedbacks