'use client';

import React from 'react'
import PictureFrame from '@/components/cards/PictureFrame'
import people from '@/data/people.json'
import ramiImg from '@/data/people/rami.png'
import rayaneImg from '@/data/people/rayaneKer.png'
import sidaliImg from '@/data/people/sidAli.png'

import { useTranslation } from '@/i18n/TranslationProvider'

type Person = {
	id: string
	fullName: string
	role: string
	username: string
	image: string
	social?: {
		instagram?: string
		linkedin?: string
		behance?: string
		website?: string
	}
}

const imageMap: Record<string, any> = {
	'rami.png': ramiImg,
	'rayaneKer.png': rayaneImg,
	'sidAli.png': sidaliImg,
}

const Team: React.FC = () => {
    const { t } = useTranslation();
	return (
		<section className="w-full py-10">
			<div className="max-w-6xl mx-auto px-6 text-center">
						<h2 className="text-2xl md:text-3xl font-bold text-white mt-5 mb-3">{t('about.meetourteam')}</h2>
						<p className="text-white/90 text-xl mb-10">{t('about.teamdescription')}</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
							{(people as Person[]).map((p) => (
						<PictureFrame
							key={p.username}
							photo={imageMap[p.image]}
							fullName={p.fullName}
							role={p.role}
							username={p.username}
							social={p.social}
						/>
					))}
				</div>

                <p className="mt-15 mb-5">
                    {t('footer.madeWith')}
                </p>

			</div>
		</section>
	)
}

export default Team

