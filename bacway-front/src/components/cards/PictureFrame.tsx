import React from 'react'
import Image from 'next/image'
import type { StaticImageData } from 'next/image'
import framebg from '@/assets/pictureFrameBg.svg'

import InstagramIcon from '@/assets/socialmedia/Instagram.svg'
import LinkedinIcon   from '@/assets/socialmedia/Linkedin.svg'
import BehanceIcon    from '@/assets/socialmedia/Behance.svg'
import GithubIcon     from '@/assets/socialmedia/Github.svg'

// ─── Types ────────────────────────────────────────────────────────────────────

type SocialLinks = {
  instagram?: string
  linkedin?:  string
  behance?:   string
  github?:    string
}

interface PictureFrameProps {
  photo:     string | StaticImageData
  fullName:  string
  role:      string
  social?:   SocialLinks
  className?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SOCIAL_ICONS: { key: keyof SocialLinks; icon: any; label: string }[] = [
  { key: 'instagram', icon: InstagramIcon, label: 'Instagram' },
  { key: 'linkedin',  icon: LinkedinIcon,  label: 'LinkedIn'  },
  { key: 'behance',   icon: BehanceIcon,   label: 'Behance'   },
  { key: 'github',    icon: GithubIcon,    label: 'GitHub'    },
]

// ─── Component ────────────────────────────────────────────────────────────────

const PictureFrame: React.FC<PictureFrameProps> = ({ photo, fullName, role, social, className = '' }) => {
  const photoSrc = typeof photo === 'string' ? photo : photo.src

  const activeLinks = SOCIAL_ICONS.filter(({ key }) => social?.[key])

  return (
    <div className={`w-full max-w-sm mx-auto ${className}`}>

      {/* ── Frame + Photo ── */}
      <div className="relative w-full h-50 md:h-60 select-none">
        <Image src={framebg} alt="Picture frame" fill priority={false} className="object-contain" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-30 h-30 md:w-37 md:h-37 overflow-hidden rounded-2xl rotate-45">
            <Image src={photoSrc} alt={fullName} fill sizes="(min-width: 768px) 192px, 160px" className="object-cover object-center -rotate-45 scale-[1.42] origin-center" />
          </div>
        </div>
      </div>

      {/* ── Details ── */}
      <div className="mt-4 text-center">
        <h3 className="text-white text-lg font-semibold">{fullName}</h3>
        <p className="text-white/60 text-sm mt-1">{role}</p>

        {activeLinks.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            {activeLinks.map(({ key, icon, label }) => (
              <a key={key} href={social![key]} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-7 h-7 opacity-50 hover:opacity-100 transition-opacity duration-200">
                <img src={typeof icon === 'string' ? icon : icon.src} alt={label} className="w-full h-full" />              </a>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default PictureFrame