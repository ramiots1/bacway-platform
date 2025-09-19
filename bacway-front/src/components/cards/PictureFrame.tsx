import React from 'react'
import Image from 'next/image'
import type { StaticImageData } from 'next/image'
import framebg from '@/assets/pictureFrameBg.svg'

type SocialLinks = {
  instagram?: string
  linkedin?: string
  behance?: string
  github?: string
}

interface PictureFrameProps {
  photo: string | StaticImageData
  fullName: string
  role: string
  username: string
  social?: SocialLinks
  className?: string
}

const PictureFrame: React.FC<PictureFrameProps> = ({
  photo,
  fullName,
  role,
  username,
  social,
  className = ''
}) => {
  const photoSrc = typeof photo === 'string' ? photo : photo.src

  return (
    <div className={`w-full max-w-sm mx-auto ${className}`}>
  {/* Frame + Photo */}
  <div className="relative w-full h-50 md:h-60 select-none">
        {/* Frame background */}
        <Image
          src={framebg}
          alt="Picture frame"
          fill
          priority={false}
          className="object-contain"
        />

        {/* Photo inside frame: diamond (mo3aian) with rounded edges via rotation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-30 h-30 md:w-37 md:h-37 overflow-hidden rounded-2xl rotate-45">
            <Image
              src={photoSrc}
              alt={`${fullName} photo`}
              fill
              sizes="(min-width: 768px) 192px, 160px"
              className="object-cover object-center -rotate-45 scale-[1.42] origin-center will-change-transform"
              priority={false}
            />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 text-center">
        <h3 className="text-white text-lg font-semibold">{fullName}</h3>
        <p className="text-white/70 text-sm mt-1">{role}</p>
        <p className="text-white/60 text-sm mt-1">@{username}</p>

        {/* Social buttons */}
        {social && (
          <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
            {social.instagram && (
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm border border-white/10 transition-colors"
                aria-label="Instagram"
              >
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-yellow-400" />
                Instagram
              </a>
            )}
            {social.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm border border-white/10 transition-colors"
                aria-label="LinkedIn"
              >
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#0A66C2]" />
                LinkedIn
              </a>
            )}
            {social.behance && (
              <a
                href={social.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm border border-white/10 transition-colors"
                aria-label="Behance"
              >
                <span className="inline-flex items-center justify-center h-4 w-4 rounded-sm bg-[#1769FF] text-[10px] font-bold">Be</span>
                Behance
              </a>
            )}
            {social.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm border border-white/10 transition-colors"
                aria-label="GitHub"
              >
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-white" />
                GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PictureFrame