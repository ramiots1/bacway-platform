"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/i18n/TranslationProvider';
import Image from 'next/image';
import catSad from '@/assets/catMood/catSad.svg';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Drive {
  name:        string;
  url:         string;
  description: string;
}

interface Submission {
  id:         string;
  createdAt:  string;
  mode:       string;
  fullName:   string;
  bacYear:    string;
  grade:      string | null;
  division:   string;
  drives:     Drive[];
  letter:     string | null;
  pictureUrl: string | null;
  contacts:   { platform: string; handle: string }[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DIVISION_KEYS = [
  'mathematics', 'science', 'technicalMath',
  'management',  'languages', 'literature',
] as const;

const DIVISION_COLORS: Record<string, string> = {
  mathematics:   '#3b82f6',
  science:       '#22c55e',
  technicalMath: '#a855f7',
  management:    '#eab308',
  languages:     '#ec4899',
  literature:    '#f97316',
};

// ─── Drive card (collapsed / expanded) ───────────────────────────────────────

const DriveRow: React.FC<{ drive: Drive; contributor: string; bacYear: string; grade: string | null; division: string; t: (k: string) => string }> = ({ drive, contributor, bacYear, grade, division, t }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/15 bg-[#111820] rounded overflow-hidden">
      {/* Collapsed row */}
      <div className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setOpen(p => !p)}>
        <span className="text-sm shrink-0">📁</span>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-semibold truncate">{drive.name || 'Untitled'}</p>
          <p className="text-white/35 text-[10px] truncate">
            {contributor} | BAC {bacYear} {t(`library.divisions.${division}`).split(' ')[0]} {grade ? `${grade}/20` : ''}
          </p>
        </div>
        <span className={`text-white/30 text-sm transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </div>

      {/* Expanded */}
      {open && (
        <div className="border-t border-white/10 px-3 py-3 space-y-2 bg-[#0e1419]">
          <div className="flex items-center gap-2 flex-wrap text-[10px] text-white/40">
            <span>BAC {bacYear}</span>
            <span>·</span>
            <span>{t(`library.divisions.${division}`)}</span>
            {grade && <><span>·</span><span className="text-blue-400 font-bold">{grade}/20</span></>}
          </div>
          <p className="text-white font-semibold text-xs">{contributor}</p>
          {drive.description && (
            <p className="text-white/50 text-xs leading-relaxed">{drive.description}</p>
          )}
          <a href={drive.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1">
            <span>Open folder</span>
            <span>↗</span>
          </a>
        </div>
      )}
    </div>
  );
};

// ─── Division Section ─────────────────────────────────────────────────────────

const DivisionSection: React.FC<{
  divisionKey: string;
  submissions: Submission[];
  t:           (k: string) => string;
  sectionRef:  React.RefObject<HTMLDivElement | null>;
}> = ({ divisionKey, submissions, t, sectionRef }) => {
  const color    = DIVISION_COLORS[divisionKey] ?? '#ffffff';
  const allDrives: { drive: Drive; s: Submission }[] = submissions.flatMap(s =>
    (s.drives ?? []).map(d => ({ drive: d, s }))
  );

  return (
    <div ref={sectionRef} id={`division-${divisionKey}`} className="scroll-mt-24">
      {/* Division header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}22`, border: `1px solid ${color}44` }}>
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm md:text-base leading-tight">
              {t(`library.divisions.${divisionKey}`)}
            </h2>
          </div>
        </div>
        <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap">
          {t('library.clickForMore')} »
        </button>
      </div>

      {/* Drive cards grid */}
      {allDrives.length === 0 ? (
        <div className="border border-white/10 rounded bg-[#111820] p-4 text-center">
          <p className="text-white/25 text-xs">{t('library.noFolders')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {allDrives.map(({ drive, s }, i) => (
            <DriveRow key={i} drive={drive} contributor={s.fullName} bacYear={s.bacYear} grade={s.grade} division={s.division} t={t} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const LibraryPage: React.FC = () => {
  const { t, locale } = useTranslation();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [query,       setQuery]       = useState('');

  // One ref per division for sidebar scroll-to
  const divisionRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>(
    Object.fromEntries(DIVISION_KEYS.map(k => [k, React.createRef<HTMLDivElement>()]))
  );

  useEffect(() => {
    fetch('/api/library')
      .then(r => r.json())
      .then(data => setSubmissions(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────

  // All unique contributors
  const contributors = useMemo(() =>
    [...new Map(submissions.map(s => [s.id, s.fullName])).values()],
    [submissions]
  );

  // Group by division, filter by query
  const byDivision = useMemo(() => {
    const q = query.toLowerCase().trim();
    return Object.fromEntries(
      DIVISION_KEYS.map(key => {
        const divSubs = submissions.filter(s => s.division === key);
        if (!q) return [key, divSubs];
        return [key, divSubs.filter(s =>
          s.fullName.toLowerCase().includes(q) ||
          s.bacYear.includes(q) ||
          s.drives?.some(d => d.name.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q))
        )];
      })
    );
  }, [submissions, query]);

  const scrollTo = (key: string) => {
    divisionRefs.current[key]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const hasAnyResults = Object.values(byDivision).some(arr => arr.length > 0);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0C1114]" dir={dir}>
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">

        {/* ── Page header ── */}
        <div className="mb-10 text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            <span suppressHydrationWarning>{t('library.title')}</span>
          </h1>
          <p className="text-white/45 text-sm max-w-lg mx-auto leading-relaxed">
            <span suppressHydrationWarning>{t('library.subtitle')}</span>
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
                <div className="grid grid-cols-2 gap-2">
                  {[...Array(4)].map((_, j) => <div key={j} className="h-16 bg-white/5 rounded animate-pulse" />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-6 items-start">

            {/* ── Main content ── */}
            <div className="flex-1 min-w-0 space-y-10">
              {!hasAnyResults && query ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                  <Image src={catSad} alt="No results" width={180} height={180} className="opacity-70" />
                  <div>
                    <h3 className="text-white font-bold text-xl mb-2">
                      <span suppressHydrationWarning>{t('library.noContributions')}</span>
                    </h3>
                    <p className="text-white/35 text-sm mb-4">
                      <span suppressHydrationWarning>{t('library.noResults')}</span>
                    </p>
                    <button onClick={() => setQuery('')} className="text-xs text-blue-400 hover:text-blue-300 underline transition-colors">
                      <span suppressHydrationWarning>{t('library.clearFilters')}</span>
                    </button>
                  </div>
                </div>
              ) : (
                DIVISION_KEYS.map(key => (
                  <DivisionSection
                    key={key}
                    divisionKey={key}
                    submissions={byDivision[key] ?? []}
                    t={t}
                    sectionRef={divisionRefs.current[key]}
                  />
                ))
              )}
            </div>

            {/* ── Sticky Sidebar ── */}
            <aside className="hidden lg:flex flex-col gap-5 w-64 shrink-0 sticky top-24">

              {/* Search */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-xs pointer-events-none">🔍</span>
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t('library.searchPlaceholder')}
                  className="w-full bg-[#111820] border border-white/15 rounded text-white text-xs px-3 py-2.5 pl-8 placeholder-white/20 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>

              {/* Contributors */}
              <div>
                <p className="text-white/50 text-[11px] uppercase tracking-widest font-semibold mb-3">
                  <span suppressHydrationWarning>{t('library.contributors')}</span>
                </p>
                <div className="space-y-1.5">
                  {contributors.length === 0 ? (
                    <p className="text-white/25 text-xs">—</p>
                  ) : (
                    contributors.map((name, i) => (
                      <p key={i} className="text-white/70 text-xs truncate hover:text-white transition-colors cursor-default">
                        {name}
                      </p>
                    ))
                  )}
                </div>
              </div>

              {/* Divisions quick-nav */}
              <div>
                <p className="text-white/50 text-[11px] uppercase tracking-widest font-semibold mb-3">
                  <span suppressHydrationWarning>{t('library.divisions.title')}</span>
                </p>
                <div className="space-y-1.5">
                  {DIVISION_KEYS.map(key => (
                    <button key={key} onClick={() => scrollTo(key)} className="block w-full text-left text-white/55 text-xs hover:text-white transition-colors truncate">
                      <span suppressHydrationWarning>{t(`library.divisions.${key}`)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link href="/contribute" className="block text-center px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded transition-colors">
                <span suppressHydrationWarning>{t('library.ctaButton')}</span>
              </Link>

            </aside>
          </div>
        )}

      </div>
    </div>
  );
};

export default LibraryPage;