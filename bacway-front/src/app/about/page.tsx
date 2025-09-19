import React from 'react'
import Hero from '@/components/About page/Hero'
import Team from '@/components/About page/Team'

const bacwayCatIcon = '/bacwayCatIcon.svg';
import Image from 'next/image';


const AboutPage = () => {
  return (
    <div>
      <Hero />
      <section className="relative overflow-visible flex bg-[rgb(12,17,20)] border-t-1 border-white/50 flex-col items-center w-full m-0">
        <div className="absolute -top-3.5 z-10 pointer-events-none select-none overflow-visible">
          <Image src={bacwayCatIcon} alt="Bacway Cat Icon" width={30} height={30} className="object-cover object-center" />
        </div>
        <Team />
      </section>
    </div>
  )
}

export default AboutPage