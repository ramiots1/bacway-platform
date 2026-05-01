"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/i18n/TranslationProvider';
import Image from 'next/image';
import catSad from '@/assets/catMood/catSad.svg';
import api from '@/app/api/axios';

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

// ─── Constants ────────────────────────────────────────────────────────────────

const DIVISION_KEYS = [
  'mathematics', 'science', 'technicalMath',
  'management',  'languages', 'literature',
] as const;

type DivisionKey = typeof DIVISION_KEYS[number];

const DIVISION_COLORS: Record<DivisionKey, string> = {
  mathematics:   '#3b82f6',
  science:       '#22c55e',
  technicalMath: '#a855f7',
  management:    '#eab308',
  languages:     '#ec4899',
  literature:    '#f97316',
};

const SPECIALITY_MAP: Record<string, DivisionKey> = {
  MATHS:      'mathematics',
  SCIENCE:    'science',
  MATH_TECH:  'technicalMath',
  GESTION:    'management',
  LANGUES:    'languages',
  LETTRE:     'literature',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toDivision = (s: string): DivisionKey => {
  const mapped = SPECIALITY_MAP[s?.toUpperCase?.()];
  if (!mapped && s) console.warn('[library] unmapped speciality:', s);
  return mapped ?? 'mathematics';
};

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

const extractArray = (data: any): any[] => {
  if (Array.isArray(data))              return data;
  if (Array.isArray(data?.content))     return data.content;
  if (Array.isArray(data?.data))        return data.data;
  if (Array.isArray(data?.submissions)) return data.submissions;
  console.warn('[library] unexpected API shape:', data);
  return [];
};

// ─── Resource row (collapsible) ───────────────────────────────────────────────

const ResourceRow: React.FC<{
  resource:    Resource;
  contributor: string;
  bacYear:     number;
  grade:       number | null;
  divisionKey: DivisionKey;
  t:           (k: string) => string;
}> = ({ resource, contributor, bacYear, grade, divisionKey, t }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/15 bg-[#111820] rounded overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-white/5 transition-colors select-none" onClick={() => setOpen(p => !p)}>
        <span className="text-sm shrink-0">📁</span>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-white text-xs font-semibold truncate">{resource.folderName || 'Untitled'}</p>
          <p className="text-white/35 text-[10px] truncate">
            {contributor} · BAC {bacYear} · {grade ? `${grade}/20` : '—'}
          </p>
        </div>
        <span className={`text-white/30 text-sm transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </div>

      {open && (
        <div className="border-t border-white/10 px-3 py-3 space-y-2 bg-[#0e1419]">
          <div className="flex items-center gap-2 flex-wrap text-[10px] text-white/40">
            <span>BAC {bacYear}</span>
            <span>·</span>
            <span suppressHydrationWarning>{t(`library.divisions.${divisionKey}`)}</span>
            {grade && <><span>·</span><span className="text-blue-400 font-bold">{grade}/20</span></>}
          </div>
          <p className="text-white font-semibold text-xs">{contributor}</p>
          {resource.description && (
            <p className="text-white/50 text-xs leading-relaxed">{resource.description}</p>
          )}
          <a href={resource.folderLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
            <span suppressHydrationWarning>{t('library.openFolder')}</span>
            <span>↗</span>
          </a>
        </div>
      )}
    </div>
  );
};

// ─── Division section ─────────────────────────────────────────────────────────

const DivisionSection: React.FC<{
  divisionKey: DivisionKey;
  submissions: Submission[];
  t:           (k: string) => string;
  sectionRef:  React.RefObject<HTMLDivElement | null>;
}> = ({ divisionKey, submissions, t, sectionRef }) => {
  const color = DIVISION_COLORS[divisionKey];

  const rows: { resource: Resource; s: Submission }[] = submissions.flatMap(s =>
    (s.resources ?? []).map(r => ({ resource: r, s }))
  );

  return (
    <div ref={sectionRef} id={`division-${divisionKey}`} className="scroll-mt-28">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}22`, border: `1px solid ${color}44` }}>
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
        </div>
        <h2 className="text-white font-bold text-sm md:text-base leading-tight">
          <span suppressHydrationWarning>{t(`library.divisions.${divisionKey}`)}</span>
        </h2>
      </div>

      {rows.length === 0 ? (
        <div className="border border-white/10 rounded bg-[#111820] p-4 text-center">
          <p className="text-white/25 text-xs"><span suppressHydrationWarning>{t('library.noFolders')}</span></p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {rows.map(({ resource, s }, i) => (
            <ResourceRow key={i} resource={resource} contributor={s.fullName} bacYear={s.bacYear} grade={s.grade} divisionKey={divisionKey} t={t} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Sidebar content (shared desktop + mobile sheet) ─────────────────────────

const SidebarContent: React.FC<{
  query:        string;
  onQuery:      (v: string) => void;
  contributors: string[];
  onScrollTo:   (key: string) => void;
  t:            (k: string) => string;
}> = ({ query, onQuery, contributors, onScrollTo, t }) => (
  <div className="flex flex-col gap-5">
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-xs pointer-events-none">🔍</span>
      <input value={query} onChange={e => onQuery(e.target.value)} placeholder={t('library.searchPlaceholder')} className="w-full bg-[#0e1419] border border-white/15 rounded text-white text-xs px-3 py-2.5 pl-8 placeholder-white/20 focus:outline-none focus:border-white/40 transition-colors" />
    </div>

    <div>
      <p className="text-white/50 text-[11px] uppercase tracking-widest font-semibold mb-2">
        <span suppressHydrationWarning>{t('library.contributors')}</span>
      </p>
      <div className="space-y-1.5">
        {contributors.length === 0
          ? <p className="text-white/25 text-xs">—</p>
          : contributors.map((name, i) => <p key={i} className="text-white/65 text-xs truncate">{name}</p>)
        }
      </div>
    </div>

    <div>
      <p className="text-white/50 text-[11px] uppercase tracking-widest font-semibold mb-2">
        <span suppressHydrationWarning>{t('library.divisions.title')}</span>
      </p>
      <div className="space-y-1">
        {DIVISION_KEYS.map(key => (
          <button key={key} onClick={() => onScrollTo(key)} className="block w-full text-left text-white/55 text-xs hover:text-white transition-colors py-1 truncate">
            <span suppressHydrationWarning>{t(`library.divisions.${key}`)}</span>
          </button>
        ))}
      </div>
    </div>

    <Link href="/contribute" className="block text-center px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded transition-colors">
      <span suppressHydrationWarning>{t('library.ctaButton')}</span>
    </Link>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const LibraryPage: React.FC = () => {
  const { t } = useTranslation();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [query,       setQuery]       = useState('');
  const [sheetOpen,   setSheetOpen]   = useState(false);

  const divisionRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>(
    Object.fromEntries(DIVISION_KEYS.map(k => [k, React.createRef<HTMLDivElement>()]))
  );

  // ── Fetch ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        const res  = await api.get('');
        const raw  = extractArray(res.data);
        const data = normalizeSubmissions(raw);

        console.log('[library] loaded:', data.length, 'submissions');
        if (data[0]) {
          console.log('[library] sample:', {
            fullName:      data[0].fullName,
            bacSpeciality: data[0].bacSpeciality,
            resourceCount: data[0].resources?.length,
          });
        }

        setSubmissions(data);
      } catch (err: any) {
        console.error('[library] fetch error:', err.message, err.response?.data);
        setError(err.message ?? 'Failed to load');
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Close sheet on desktop resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setSheetOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────

  const contributors = useMemo(() =>
    [...new Map(submissions.map(s => [s.id, s.fullName])).values()],
    [submissions]
  );

  const byDivision = useMemo(() => {
    const q = query.toLowerCase().trim();
    return Object.fromEntries(
      DIVISION_KEYS.map(key => {
        const divSubs = submissions.filter(s => toDivision(s.bacSpeciality) === key);
        if (!q) return [key, divSubs];
        return [key, divSubs.filter(s =>
          s.fullName.toLowerCase().includes(q) ||
          s.bacYear.toString().includes(q) ||
          s.resources?.some(r =>
            r.folderName.toLowerCase().includes(q) ||
            r.description?.toLowerCase().includes(q)
          )
        )];
      })
    ) as Record<DivisionKey, Submission[]>;
  }, [submissions, query]);

  const hasAnyResults = Object.values(byDivision).some(arr => arr.length > 0);

  const scrollTo = (key: string) => {
    setSheetOpen(false);
    setTimeout(() => {
      divisionRefs.current[key]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 320);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0C1114]">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">

        {/* ── Header ── */}
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

          {/* Mobile filter button */}
          <div className="flex justify-center gap-2 pt-2 lg:hidden">
            <button onClick={() => setSheetOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/15 rounded text-white/70 text-xs hover:bg-white/10 transition-colors">
              <span>🔍</span>
              <span suppressHydrationWarning>{t('library.searchPlaceholder')}</span>
              <span className="text-white/30">·</span>
              <span suppressHydrationWarning>{t('library.divisions.title')}</span>
            </button>
          </div>
        </div>

        {/* ── Dev debug banner ── */}
        {process.env.NODE_ENV === 'development' && !loading && (
          <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-300/70 space-y-0.5">
            <p>Submissions loaded: <strong>{submissions.length}</strong></p>
            {submissions[0] && (
              <>
                <p>Sample bacSpeciality: <strong>{submissions[0].bacSpeciality}</strong> → <strong>{toDivision(submissions[0].bacSpeciality)}</strong></p>
                <p>Sample resources: <strong>{submissions[0].resources?.length ?? 0}</strong></p>
              </>
            )}
            {error && <p className="text-red-400">Error: {error}</p>}
          </div>
        )}

        {/* ── Loading ── */}
        {loading ? (
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(4)].map((_, j) => <div key={j} className="h-16 bg-white/5 rounded animate-pulse" />)}
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden lg:block w-64 shrink-0 space-y-3">
              {[...Array(7)].map((_, i) => <div key={i} className="h-5 bg-white/5 rounded animate-pulse" />)}
            </div>
          </div>

        ) : error ? (
          // ── Fetch error state ──
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <p className="text-white/30 text-sm">Failed to load library.</p>
            <button onClick={() => window.location.reload()} className="text-xs text-blue-400 hover:text-blue-300 underline transition-colors">
              Try again
            </button>
          </div>

        ) : (
          <div className="flex flex-row gap-6 items-start">

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
              ) : submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                  <Image src={catSad} alt="Empty" width={180} height={180} className="opacity-70" />
                  <p className="text-white/35 text-sm">
                    <span suppressHydrationWarning>{t('library.noContributions')}</span>
                  </p>
                  <Link href="/contribute" className="text-xs text-blue-400 hover:text-blue-300 underline transition-colors">
                    <span suppressHydrationWarning>{t('library.ctaButton')}</span>
                  </Link>
                </div>
              ) : (
                DIVISION_KEYS.map(key => (
                  <DivisionSection key={key} divisionKey={key} submissions={byDivision[key] ?? []} t={t} sectionRef={divisionRefs.current[key]} />
                ))
              )}
            </div>

            {/* ── Desktop sidebar (always right) ── */}
            <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
              <SidebarContent query={query} onQuery={setQuery} contributors={contributors} onScrollTo={scrollTo} t={t} />
            </aside>

          </div>
        )}
      </div>

      {/* ── Mobile bottom sheet backdrop ── */}
      {sheetOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSheetOpen(false)} />
      )}

      {/* ── Mobile bottom sheet ── */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#111820] border-t border-white/15 rounded-t-2xl transition-transform duration-300 ease-out ${sheetOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 pb-3 border-b border-white/10">
          <p className="text-white text-sm font-semibold">
            <span suppressHydrationWarning>{t('library.filterLabel')}</span>
          </p>
          <button onClick={() => setSheetOpen(false)} className="text-white/40 hover:text-white text-xl leading-none transition-colors">×</button>
        </div>
        <div className="overflow-y-auto max-h-[70vh] px-5 py-4">
          <SidebarContent query={query} onQuery={setQuery} contributors={contributors} onScrollTo={scrollTo} t={t} />
        </div>
      </div>

    </div>
  );
};

export default LibraryPage;