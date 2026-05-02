'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import catSad from '@/assets/catMood/catSad.svg'
import folderIcon from '@/assets/folderIcon.svg' // Make sure this path is correct
import { useTranslation } from '@/i18n/TranslationProvider';
import api from '@/app/api/axios';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Contact  { type: string; contact: string }
interface Resource { folderName: string; folderLink: string; description: string }

interface Submission {
  id:            string;
  email:         string;
  fullName:      string;
  bacYear:       number;
  grade:         number | null;
  bacSpeciality: string;
  pictureLink:   string | null;
  letter:        string | null;
  contacts:      Contact[];
  resources:     Resource[];
  createdAt?:    string;
}

interface Division {
  id: string;
  nameKey: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SPECIALITY_MAP: Record<string, string> = {
  MATHS:     'mathematics',
  SCIENCE:   'science',
  MATH_TECH: 'technicalMath',
  GESTION:   'management',
  LANGUES:   'languages',
  LETTRE:    'literature',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toDivision = (s: string): string =>
  SPECIALITY_MAP[s?.toUpperCase?.()] ?? 'mathematics';

const normalizeSubmissions = (raw: any[]): Submission[] =>
  raw.map(s => ({
    ...s,
    bacSpeciality: s.bacSpeciality ?? s.bac_speciality ?? s.speciality ?? '',
    resources:     s.resources     ?? s.drives         ?? [],
    contacts:      s.contacts      ?? [],
    fullName:      s.fullName      ?? s.full_name       ?? '',
    bacYear:       s.bacYear       ?? s.bac_year        ?? 0,
    grade:         s.grade         ?? null,
    pictureLink:   s.pictureLink   ?? s.picture_link    ?? null,
    letter:        s.letter        ?? null,
  }));

const extractArray = (data: unknown): any[] => {
  if (Array.isArray(data))                              return data;
  if (data && Array.isArray((data as any).content))     return (data as any).content;
  if (data && Array.isArray((data as any).data))        return (data as any).data;
  if (data && Array.isArray((data as any).submissions)) return (data as any).submissions;
  return [];
};

// ─── Resource card ────────────────────────────────────────────────────────────

const ResourceCard: React.FC<{
  resource:    Resource;
  contributor: string;
  bacYear:     number;
  grade:       number | null;
}> = ({ resource, contributor, bacYear, grade }) => (
  <a href={resource.folderLink} target="_blank" rel="noopener noreferrer" className="flex flex-col border rounded-2xl border-white/50 bg-white/5 overflow-hidden hover:bg-white/8 transition-colors">
    <div className="flex items-center gap-3 px-3 py-2.5">
      <span className="shrink-0">
        <Image src={folderIcon} alt="Folder" width={30} height={30} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-white text-[15px] font-semibold truncate">
          {resource.folderName || 'Untitled'}
        </p>
        <p className="text-white/50 text-[12px] line-clamp-2 mt-0.5">
          {contributor} · BAC {bacYear}{grade ? ` · ${grade}` : ''}
        </p>
      </div>
    </div>
  </a>
);

// ─── Main component ───────────────────────────────────────────────────────────

const Library = () => {
  const { t, locale } = useTranslation();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState<string | null>('mathematics');

  const divisions: Division[] = [
    { id: 'mathematics', nameKey: 'mathematics' },
    { id: 'science', nameKey: 'science' },
    { id: 'technicalMath', nameKey: 'technicalMath' },
    { id: 'management', nameKey: 'management' },
    { id: 'languages', nameKey: 'languages' },
    { id: 'literature', nameKey: 'literature' },
  ];

  const isRTL = locale === 'ar';

  // ── Fetch ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await api.get('');
        if (cancelled) return;
        setSubmissions(normalizeSubmissions(extractArray(res.data)));
      } catch (err) {
        if (!cancelled) console.error('Failed to load submissions:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // ── Get resources for selected division ────────────────────────────────────

  const selectedResources = useMemo(() => {
    if (!selectedDivision || !submissions.length) return [];
    
    const rows: { resource: Resource; s: Submission }[] = [];
    submissions.forEach(s => {
      if (toDivision(s.bacSpeciality) === selectedDivision) {
        (s.resources ?? []).forEach(r => {
          rows.push({ resource: r, s });
        });
      }
    });
    
    return rows.slice(0, 4); // Max 4 resources
  }, [submissions, selectedDivision]);

  return (
    <div className=' w-full relative z-50'>
      {/* Header Section */}
      <div className='flex flex-col items-center justify-center py-10 px-0'>
        <Image src="/bacwayLibrary.svg" alt="Bacway Library Logo" width={100} height={100} className=' h-25 md:h-30' />
        <h2 className='text-white text-3xl md:text-5xl mt-2 font-bold'>{t('library.title')}</h2>
        <p className='text-gray-300 text-sm md:text-base text-center max-w-2xl mt-4 px-5'>{t('library.subtitle')}</p>
      </div>

      {/* Two Column Layout */}
      <div className=" m-0 border-y border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 ">

          {/* Left Column - Drive Folders/Resources */}
          <div>
            <div className="h-full flex items-start justify-center p-6">
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-white/25 text-xs animate-pulse">Please wait...</p>
                </div>
              ) : selectedDivision && selectedResources.length > 0 ? (
                // 1-column grid for resources
                <div className="w-full">
                  <div className="grid grid-cols-1 gap-3">
                    {selectedResources.map(({ resource, s }, i) => (
                      <ResourceCard key={i} resource={resource} contributor={s.fullName} bacYear={s.bacYear} grade={s.grade} />
                    ))}
                  </div>
                </div>
              ) : selectedDivision ? (
                // No contributions
                <div className="flex my-8 flex-col height-full justify-center items-center gap-3">
                  <Image
                    src={catSad}
                    alt="No Contributions"
                    width={300}
                    height={300}
                  />
                  <p className="text-white/100 text-2xl text-center">
                    {isRTL ? 'لا توجد مساهمات' : 'No contributions yet'}
                  </p>
                </div>
              ) : (
                // No division selected
                <div className="flex flex-col items-center justify-center py-16">
                  <p className={`text-gray-500 text-center ${isRTL ? 'font-arabic' : 'font-outfit'}`}>
                    {isRTL ? 'اختر شعبة لعرض الموارد' : 'Select a division to view resources'}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - BAC Divisions */}
          <div className="py-8 not-md:border-t md:border-l border-white/20 px-5 md:px-10">
            <div className="">
              {divisions.map((division) => (
                <div
                  key={division.id}
                  className={`border-b border-white/20 p-4 cursor-pointer transition-all duration-300 hover:bg-gray-800/60`}
                  onClick={() => setSelectedDivision(division.id)}
                >
                  <div className={`flex flex-col gap-3 ${isRTL ? 'font-arabic text-right' : 'font-outfit'}`}>
                    {/* Division Name */}
                    <h4 className={`text-lg font-semibold transition-colors`}>
                      {t(`library.divisions.${division.nameKey}` as any)}
                    </h4>
                    
                    {/* Login for more resources */}
                    {selectedDivision === division.id && (
                      <Link
                        href="/library"
                        className={`text-sm mb-1 text-blue-400 hover:text-blue-300 cursor-pointer transition-all duration-200 ${
                          isRTL ? 'text-right font-arabic' : 'text-left font-outfit'
                        }`}
                      >
                        {t('library.loginForMore')}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Library