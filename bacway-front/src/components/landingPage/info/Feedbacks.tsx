import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTranslation } from '@/i18n/TranslationProvider';

// Social media SVG icons
import FacebookIcon from '@/assets/socialmedia/Facebook.svg'
import InstagramIcon from '@/assets/socialmedia/Instagram.svg'
import LinkedinIcon from '@/assets/socialmedia/Linkedin.svg'
import EmailIcon from '@/assets/socialmedia/Gmail.svg'

// ─── Types ────────────────────────────────────────────────────────────────────

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
  imageUrl?:   string   // remote URL from API
  letter:      string
  contact:     Contact
}

// Raw shape returned by the API
interface ApiContributor {
  id:            string
  fullName?:     string
  full_name?:    string
  bacYear?:      number
  bac_year?:     number
  bacSpeciality?: string
  bac_speciality?: string
  speciality?:   string
  grade?:        number | string | null
  pictureLink?:  string
  picture_link?: string
  letter?:       string | null
  contacts?:     Array<{ type: string; contact: string }>
  role?:         string
}

// ─── Cache ────────────────────────────────────────────────────────────────────

const CACHE_KEY = 'feedbacks_contributors_v1'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const readCache = (): { data: unknown; stale: boolean } | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const entry: { data: unknown; timestamp: number } = JSON.parse(raw)
    return { data: entry.data, stale: Date.now() - entry.timestamp > CACHE_TTL }
  } catch {
    return null
  }
}

const writeCache = (data: unknown) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
  } catch { /* quota exceeded or SSR — ignore */ }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isArabic = (text: string) => /[\u0600-\u06FF\u0750-\u077F]/.test(text)

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

const contactTypeMap: Record<string, keyof Contact> = {
  INSTAGRAM: 'instagram',
  LINKEDIN:  'linkedin',
  FACEBOOK:  'facebook',
  EMAIL:     'email',
  GMAIL:     'email',
}

const extractArray = (data: unknown): any[] => {
  if (Array.isArray(data))                              return data
  if (data && Array.isArray((data as any).content))     return (data as any).content
  if (data && Array.isArray((data as any).data))        return (data as any).data
  if (data && Array.isArray((data as any).submissions)) return (data as any).submissions
  return []
}

const normalize = (raw: ApiContributor[]): Feedback[] =>
  raw
    .filter((c) => c.letter) // only show contributors who wrote a letter
    .map((c) => {
      const fullName    = c.fullName ?? c.full_name ?? 'Unknown'
      const bacYear     = c.bacYear  ?? c.bac_year  ?? 0
      const speciality  = c.bacSpeciality ?? c.bac_speciality ?? c.speciality ?? ''
      const grade       = c.grade != null ? String(c.grade) : ''
      const pictureLink = c.pictureLink ?? c.picture_link ?? undefined

      // Map contacts array → flat object
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
        bacdivision: speciality.toLowerCase(),
        grade,
        initials:    getInitials(fullName),
        imageUrl:    pictureLink,
        letter:      c.letter ?? '',
        contact,
      }
    })

// ─── Data hook ────────────────────────────────────────────────────────────────

const useFeedbacks = () => {
  const [items, setItems] = useState<Feedback[]>([])

  useEffect(() => {
    let cancelled = false

    const fetchFresh = async (background: boolean) => {
      try {
        const res  = await fetch(process.env.NEXT_PUBLIC_API_URL!)
        const json = await res.json()
        if (cancelled) return
        const normalized = normalize(extractArray(json))
        setItems(normalized)
        writeCache(json)
      } catch {
        // In background mode keep showing cached data silently
        if (!background && !cancelled) setItems([])
      }
    }

    // 1️⃣ Serve cache instantly
    const cached = readCache()
    if (cached) {
      setItems(normalize(extractArray(cached.data)))
      if (!cached.stale) return
      // Stale — refresh silently in background
      fetchFresh(true)
      return () => { cancelled = true }
    }

    // 2️⃣ No cache — fetch normally
    fetchFresh(false)
    return () => { cancelled = true }
  }, [])

  return items
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const Avatar: React.FC<{ f: Feedback }> = ({ f }) =>
  f.imageUrl ? (
    <div className="w-11 h-11 md:w-14 md:h-14 rounded-full overflow-hidden border border-white/20 shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={f.imageUrl} alt={f.name} className="object-cover w-full h-full" />
    </div>
  ) : (
    <div className="w-11 h-11 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-gray-800 to-gray-900 shrink-0">
      {f.initials}
    </div>
  )

const SocialLinks: React.FC<{ contact: Contact }> = ({ contact }) => {
  const links = [
    { href: contact.instagram,                                            icon: InstagramIcon, label: 'Instagram' },
    { href: contact.linkedin,                                             icon: LinkedinIcon,  label: 'LinkedIn'  },
    { href: contact.facebook,                                             icon: FacebookIcon,  label: 'Facebook'  },
    { href: contact.email ? `mailto:${contact.email}` : undefined,       icon: EmailIcon,     label: 'Email'     },
  ].filter((l): l is typeof l & { href: string } => !!l.href)

  if (!links.length) return null

  return (
    <div className="flex items-center gap-5 mt-3">
      {links.map(({ href, icon, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-6 h-6 opacity-60 hover:opacity-100 transition-opacity duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={icon.src ?? icon} alt={label} className="w-full h-full" />
        </a>
      ))}
    </div>
  )
}

const Card: React.FC<{ f: Feedback }> = ({ f }) => {
  const { t } = useTranslation()
  const arabic = isArabic(f.letter)

  return (
    <article className="flex-none w-72 md:w-96 border-l border-b border-white/20 group">
      <div className="p-5 md:p-6 h-88 md:h-100 flex flex-col gap-4">

        {/* Header: avatar + name/role + grade badge */}
        <div className="flex items-start gap-3">
          <Avatar f={f} />

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm md:text-base truncate font-sans leading-tight">
              {f.name}
            </h3>
            <p className="text-gray-400 text-xs md:text-sm truncate font-sans">
              {t(`contributorDiscription.roles.${f.role}`, { defaultValue: f.role })}
            </p>
            <p className="text-gray-400 text-[11px] md:text-xs font-sans mt-0.5">
              Bac {f.bacyear}{f.grade ? ` · ${f.grade}` : ''}{f.bacdivision ? ` · ${t(`library.divisions.${f.bacdivision}`, { defaultValue: f.bacdivision })}` : ''}
            </p>
          </div>
        </div>

        {/* Letter / testimonial */}
        <p
          className={`flex-1 text-gray-300 text-[11px] md:text-sm leading-relaxed line-clamp-6 font-sans ${
            arabic ? 'text-right direction-rtl' : 'text-left'
          }`}
          dir={arabic ? 'rtl' : 'ltr'}
        >
          {f.letter}
        </p>

        {/* Social links */}
        <SocialLinks contact={f.contact} />
      </div>
    </article>
  )
}

const ScrollingTrack: React.FC<{ items: Feedback[]; duration: number; reverse?: boolean }> = ({
  items,
  duration,
  reverse,
}) => (
  <div className="overflow-hidden">
    <div
      className={`flex ${reverse ? 'marquee-reverse' : 'marquee-forward'}`}
      style={{ ['--duration' as any]: `${duration}s` } as React.CSSProperties}
    >
      {[...items, ...items].map((f, i) => (
        <Card key={`${f.id}-${i}`} f={f} />
      ))}
    </div>

    <style jsx>{`
      .marquee-forward,
      .marquee-reverse {
        display: flex;
        width: fit-content;
        align-items: stretch;
      }
      @keyframes scroll-left {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
      @keyframes scroll-right {
        from { transform: translateX(-50%); }
        to   { transform: translateX(0); }
      }
      .marquee-forward {
        animation: scroll-left var(--duration, 30s) linear infinite;
        will-change: transform;
      }
      .marquee-reverse {
        animation: scroll-right var(--duration, 30s) linear infinite;
        will-change: transform;
      }
      .marquee-forward:hover,
      .marquee-reverse:hover {
        animation-play-state: paused;
      }
    `}</style>
  </div>
)

// ─── Main export ──────────────────────────────────────────────────────────────

const Feedbacks: React.FC = () => {
  const items = useFeedbacks()

  if (!items.length) return null

  return (
    <section className="w-full">
      <div className="relative border-t border-white/20">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 w-28 h-full bg-gradient-to-r from-[#0B0F11] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-28 h-full bg-gradient-to-l from-[#0B0F11] to-transparent z-10 pointer-events-none" />

        <ScrollingTrack items={items} duration={25} />
      </div>
    </section>
  )
}

export default Feedbacks