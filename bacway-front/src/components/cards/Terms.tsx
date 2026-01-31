'use client';

import React from 'react'
import { useTranslation } from '@/i18n/TranslationProvider'

const Terms: React.FC = () => {
  const { t, locale } = useTranslation();
  const isAr = locale === 'ar';
  return (
    <section className="w-full py-10" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto px-6">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{t('terms.title')}</h1>
          <p className="mt-3 text-white/80">{t('terms.intro')}</p>
        </header>

        <div className="space-y-8 text-white/85 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white">{t('terms.definitions.title')}</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>
                {t('terms.definitions.bacStudent')}
              </li>
              <li>
                {t('terms.definitions.contributor')}
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>
                    {t('terms.definitions.teacherContributors')}
                  </li>
                  <li>
                    {t('terms.definitions.studentContributors')}
                  </li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">{t('terms.registration.title')}</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>{t('terms.registration.item1')}</li>
              <li>{t('terms.registration.item2')}</li>
              <li>{t('terms.registration.item3')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">{t('terms.duration.title')}</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>{t('terms.duration.item1')}</li>
              <li>{t('terms.duration.item2')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">{t('terms.content.title')}</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>{t('terms.content.item1')}</li>
              <li>{t('terms.content.item2')}</li>
              <li>{t('terms.content.item3')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">{t('terms.privacy.title')}</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>{t('terms.privacy.item1')}</li>
              <li>{t('terms.privacy.item2')}</li>
              <li>{t('terms.privacy.item3')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">{t('terms.usage.title')}</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>{t('terms.usage.item1')}</li>
              <li>{t('terms.usage.item2')}</li>
              <li>{t('terms.usage.item3')}</li>
            </ul>
          </section>

          <section>
            <p className="text-white/75">{t('terms.changesNotice')}</p>
          </section>

          <section>
            <p className="text-white/80">
              {t('terms.contact')}
              <a href="mailto:bacwaydz@gmail.com" className='underline'>bacwaydz@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}

export default Terms