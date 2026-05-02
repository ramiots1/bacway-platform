"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/i18n/TranslationProvider';
import Image from 'next/image';
import catSad from '@/assets/catMood/catSad.svg';
import folderIcon from '@/assets/folderIcon.svg';
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

interface CacheEntry {
  data:      unknown;
  timestamp: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DIVISION_KEYS = [
  'mathematics', 'science', 'technicalMath',
  'management',  'languages', 'literature',
] as const;

type DivisionKey = typeof DIVISION_KEYS[number];

const SPECIALITY_MAP: Record<string, DivisionKey> = {
  MATHS:     'mathematics',
  SCIENCE:   'science',
  MATH_TECH: 'technicalMath',
  GESTION:   'management',
  LANGUES:   'languages',
  LETTRE:    'literature',
};

const CACHE_KEY = 'library_submissions_v1';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toDivision = (s: string): DivisionKey =>
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

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'Failed to load';

// ─── Cache helpers ────────────────────────────────────────────────────────────

const readCache = (): { data: unknown; stale: boolean } | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    return { data: entry.data, stale: Date.now() - entry.timestamp > CACHE_TTL };
  } catch {
    return null;
  }
};

const writeCache = (data: unknown) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() } satisfies CacheEntry));
  } catch { /* quota exceeded or SSR — ignore */ }
};

// ─── useSubmissions hook ──────────────────────────────────────────────────────

const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [refreshing,  setRefreshing]  = useState(false); // silent background refresh

  useEffect(() => {
    let cancelled = false;

    const fetchFresh = async (background: boolean) => {
      try {
        const res = await api.get('');
        if (cancelled) return;
        const normalized = normalizeSubmissions(extractArray(res.data));
        setSubmissions(normalized);
        writeCache(res.data);
      } catch (err) {
        if (cancelled) return;
        // In background mode don't overwrite the stale data with an error
        if (!background) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    // 1️⃣ Try cache first → instant render
    const cached = readCache();
    if (cached) {
      setSubmissions(normalizeSubmissions(extractArray(cached.data)));
      setLoading(false);

      if (!cached.stale) return; // Fresh — no network call needed

      // Stale — show cached data immediately, refresh silently in background
      setRefreshing(true);
      fetchFresh(true);
      return () => { cancelled = true; };
    }

    // 2️⃣ No cache — normal fetch (show skeleton until done)
    fetchFresh(false);
    return () => { cancelled = true; };
  }, []);

  return { submissions, loading, error, refreshing };
};

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputCls = "w-full text-white text-xs px-3 py-2.5 placeholder-white/25 focus:outline-none focus:border-white/40 transition-colors";

// ─── Resource row ─────────────────────────────────────────────────────────────

const ResourceRow: React.FC<{
  resource:    Resource;
  contributor: string;
  bacYear:     number;
  grade:       number | null;
  contacts:    Contact[];
  t:           (k: string) => string;
}> = ({ resource, contributor, bacYear, grade, contacts, t }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col border rounded-2xl border-white/50 bg-white/5 overflow-hidden">
      {/* Collapsed header */}
      <div className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-white/5 transition-colors select-none" onClick={() => setOpen(p => !p)}>
        <span className="text-sm shrink-0">
          <Image src={folderIcon} alt="Folder" width={23} height={22} />
        </span>
        <div className="flex-1 min-w-0">
          <a href={resource.folderLink} target="_blank" rel="noopener noreferrer" className="text-white text-xs font-semibold truncate hover:text-blue-400 transition-colors block" onClick={e => e.stopPropagation()}>
            {resource.folderName || 'Untitled'}
          </a>
          <p className="text-white/50 text-[10px] line-clamp-2 mt-0.5">
            {contributor} · BAC {bacYear}{grade ? ` · ${grade}` : ''}
          </p>
        </div>
        <span className={`text-white/50 text-xs transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`}>▾</span>
      </div>

      {/* Expanded */}
      {open && (
        <div className="border-t border-white/10 px-3 py-3 space-y-3 bg-white/3 flex-1">
          {resource.description ? (
            <p className="text-white/80 text-xs whitespace-pre-wrap break-words">{resource.description}</p>
          ) : (
            <p className="text-white/20 text-xs italic">No description provided.</p>
          )}
          {contacts.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-1 border-t border-white/8">
              {contacts.map((c, i) => (
                <a key={i} href={c.contact.startsWith('http') ? c.contact : `https://${c.contact}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors capitalize">
                  {c.type.charAt(0) + c.type.slice(1).toLowerCase()}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Masonry Grid ─────────────────────────────────────────────────────────────

interface MasonryGridProps {
  items: Array<{ resource: Resource; s: Submission }>;
  t: (k: string) => string;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ items, t }) => (
  <div className="flex gap-2 items-start w-full lg:gap-3">
    <div className="w-1/2 flex flex-col gap-2 lg:gap-3">
      {items.filter((_, i) => i % 2 === 0).map(({ resource, s }, i) => (
        <ResourceRow key={i} resource={resource} contributor={s.fullName} bacYear={s.bacYear} grade={s.grade} contacts={s.contacts ?? []} t={t} />
      ))}
    </div>
    <div className="w-1/2 flex flex-col gap-2 lg:gap-3">
      {items.filter((_, i) => i % 2 !== 0).map(({ resource, s }, i) => (
        <ResourceRow key={i} resource={resource} contributor={s.fullName} bacYear={s.bacYear} grade={s.grade} contacts={s.contacts ?? []} t={t} />
      ))}
    </div>
  </div>
);

// ─── Division section ─────────────────────────────────────────────────────────

const DivisionSection: React.FC<{
  divisionKey: DivisionKey;
  submissions: Submission[];
  t:           (k: string) => string;
  sectionRef:  React.RefObject<HTMLDivElement | null>;
}> = ({ divisionKey, submissions, t, sectionRef }) => {
  const rows: { resource: Resource; s: Submission }[] = submissions.flatMap(s =>
    (s.resources ?? []).map(r => ({ resource: r, s }))
  );

  return (
    <div ref={sectionRef} id={`division-${divisionKey}`} className="scroll-mt-28">
      <h2 className="text-white font-bold text-sm md:text-base mb-3">
        <span suppressHydrationWarning>{t(`library.divisions.${divisionKey}`)}</span>
      </h2>

      {rows.length === 0 ? (
        <div className="border rounded-2xl border-white/50 bg-white/3 p-4 text-center">
          <p className="text-white/50 text-xs"><span suppressHydrationWarning>{t('library.noFolders')}</span></p>
        </div>
      ) : (
        <MasonryGrid items={rows} t={t} />
      )}
    </div>
  );
};

// ─── Search results (flat list, no division headers) ──────────────────────────

const SearchResults: React.FC<{
  rows: { resource: Resource; s: Submission; divisionKey: DivisionKey }[];
  t:   (k: string) => string;
  onClear: () => void;
}> = ({ rows, t, onClear }) => {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-5 text-center">
        <Image src={catSad} alt="Empty" width={300} height={250} className="opacity-100" />
        <p className="text-white/100 text-xl">
          <span suppressHydrationWarning>{t('library.noResults')}</span>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/50 text-xs">
          {rows.length} result{rows.length !== 1 ? 's' : ''}
        </p>
        <button onClick={onClear} className="text-xs text-white/50 hover:text-white transition-colors underline">
          <span suppressHydrationWarning>{t('library.clearFilters')}</span>
        </button>
      </div>
      <MasonryGrid items={rows} t={t} />
    </div>
  );
};

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────

const DesktopSidebar: React.FC<{
  query:       string;
  inputValue:  string;
  onInput:     (v: string) => void;
  onSearch:    () => void;
  onScrollTo:  (key: string) => void;
  t:           (k: string) => string;
}> = ({ inputValue, onInput, onSearch, onScrollTo, t }) => (
  <div className="border rounded-2xl border-white/50 bg-white/3 p-4 flex flex-col gap-5">
    {/* Search with button */}
    <div className="flex gap-2 border border-white/50 rounded-lg p-0.5">
      <input
        value={inputValue}
        onChange={e => onInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSearch()}
        placeholder={t('library.searchPlaceholder')}
        className={`${inputCls} flex-1`}
      />
      <button onClick={onSearch} className="px-3 py-2 m-1 rounded-lg bg-blue-500 hover:bg-blue-300 text-white text-xs font-semibold transition-colors shrink-0">
        {t('library.divisions.searchButton')}
      </button>
    </div>

    {/* Divisions nav */}
    <div>
      <p className="text-white/100 text-[15px] font-semibold mb-2">
        <span suppressHydrationWarning>{t('library.divisions.title')}</span>
      </p>
      <div className="space-y-1">
        {DIVISION_KEYS.map(key => (
          <button key={key} onClick={() => onScrollTo(key)} className="block w-full text-left text-white/55 text-xs hover:text-white transition-colors py-1">
            <span suppressHydrationWarning>{t(`library.divisions.${key}`)}</span>
          </button>
        ))}
      </div>
    </div>

    <Link href="/contribute" className="block rounded-lg text-center px-4 py-2.5 bg-blue-500 hover:bg-blue-300 text-white text-xs font-semibold transition-colors">
      <span suppressHydrationWarning>{t('library.ctaButton')}</span>
    </Link>
  </div>
);

// ─── Mobile top search bar ────────────────────────────────────────────────────

const MobileSearchBar: React.FC<{
  inputValue:       string;
  onInput:          (v: string) => void;
  onSearch:         () => void;
  divisionOpen:     boolean;
  onToggleDivision: () => void;
  onScrollTo:       (key: string) => void;
  t:                (k: string) => string;
}> = ({ inputValue, onInput, onSearch, divisionOpen, onToggleDivision, onScrollTo, t }) => (
  <div className="lg:hidden mb-6 space-y-2">
    {/* Search row */}
    <div className="border border-white/50 rounded-2xl flex gap-2">
      <input
        value={inputValue}
        onChange={e => onInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSearch()}
        placeholder={t('library.searchPlaceholder')}
        className={`${inputCls} flex-1`}
      />
      <button onClick={onSearch} className="px-3 py-2 m-1 rounded-lg bg-blue-500 hover:bg-blue-300 text-white text-xs font-semibold transition-colors shrink-0">
        {t('library.divisions.searchButton')}
      </button>
    </div>

    {/* Divisions toggle */}
    <button onClick={onToggleDivision} className="w-full flex items-center justify-between px-3 py-2.5 border rounded-2xl border-white/50 bg-white/5 text-white/60 text-xs hover:bg-white/8 transition-colors">
      <span suppressHydrationWarning>{t('library.divisions.title')}</span>
      <span className={`text-white/30 text-xs transition-transform duration-200 ${divisionOpen ? 'rotate-180' : ''}`}>▾</span>
    </button>

    {/* Division list dropdown */}
    {divisionOpen && (
      <div className="border border-white/50 rounded-2xl bg-white/5 divide-y divide-white/8">
        {DIVISION_KEYS.map(key => (
          <button key={key} onClick={() => { onScrollTo(key); onToggleDivision(); }} className="block w-full text-left px-4 py-2.5 text-white/65 text-xs hover:text-white hover:bg-white/5 transition-colors">
            <span suppressHydrationWarning>{t(`library.divisions.${key}`)}</span>
          </button>
        ))}
      </div>
    )}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const LibraryPage: React.FC = () => {
  const { t } = useTranslation();

  const { submissions, loading, error, refreshing } = useSubmissions();

  const [inputValue,   setInputValue]   = useState('');
  const [activeQuery,  setActiveQuery]  = useState('');
  const [divisionOpen, setDivisionOpen] = useState(false);

  const divisionRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>(
    Object.fromEntries(DIVISION_KEYS.map(k => [k, React.createRef<HTMLDivElement>()]))
  );

  // ── Derived ───────────────────────────────────────────────────────────────

  const searchRows = useMemo(() => {
    const q = activeQuery.toLowerCase().trim();
    if (!q) return null;

    const results: { resource: Resource; s: Submission; divisionKey: DivisionKey }[] = [];
    submissions.forEach(s => {
      const dk = toDivision(s.bacSpeciality);
      (s.resources ?? []).forEach(r => {
        const match =
          s.fullName.toLowerCase().includes(q) ||
          s.bacYear.toString().includes(q) ||
          r.folderName.toLowerCase().includes(q) ||
          (r.description ?? '').toLowerCase().includes(q);
        if (match) results.push({ resource: r, s, divisionKey: dk });
      });
    });
    return results;
  }, [submissions, activeQuery]);

  const byDivision = useMemo(() =>
    Object.fromEntries(
      DIVISION_KEYS.map(key => [
        key,
        submissions.filter(s => toDivision(s.bacSpeciality) === key),
      ])
    ) as Record<DivisionKey, Submission[]>,
    [submissions]
  );

  const handleSearch = () => setActiveQuery(inputValue);
  const handleClear  = () => { setActiveQuery(''); setInputValue(''); };

  const scrollTo = (key: string) => {
    setTimeout(() => {
      divisionRefs.current[key]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0C1114]">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">

        {/* ── Header ── */}
        <div className="mb-8 text-center space-y-3">
          <div className="flex justify-center mb-5">
            <Image src="/bacwayLibrary.svg" alt="Bacway Library" width={64} height={64} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            <span suppressHydrationWarning>{t('library.title')}</span>
          </h1>
          <p className="text-white/45 text-sm max-w-lg mx-auto leading-relaxed">
            <span suppressHydrationWarning>{t('library.subtitle')}</span>
          </p>
        </div>

        {/* ── Loading ── */}
        {loading ? (
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-5 w-40 bg-white/5 animate-pulse" />
                  <div className="flex gap-2">
                    <div className="flex-1 h-14 bg-white/5 animate-pulse" />
                    <div className="flex-1 h-14 bg-white/5 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden lg:block w-60 shrink-0 space-y-3">
              {[...Array(8)].map((_, i) => <div key={i} className="h-4 bg-white/5 animate-pulse" />)}
            </div>
          </div>

        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <p className="text-white/30 text-sm">Something is wrong.</p>
            <button onClick={() => window.location.reload()} className="text-xs text-blue-400 hover:text-blue-300 underline transition-colors">
              Try again
            </button>
          </div>

        ) : (
          <div>
            {/* Mobile search + divisions */}
            <MobileSearchBar
              inputValue={inputValue}
              onInput={setInputValue}
              onSearch={handleSearch}
              divisionOpen={divisionOpen}
              onToggleDivision={() => setDivisionOpen(p => !p)}
              onScrollTo={scrollTo}
              t={t}
            />

            <div className="flex flex-row gap-8 items-start">

              {/* ── Main content ── */}
              <div className="flex-1 min-w-0">
                {searchRows !== null ? (
                  <SearchResults rows={searchRows} t={t} onClear={handleClear} />
                ) : submissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
                    <Image src={catSad} alt="Empty" width={160} height={160} className="opacity-70" />
                    <p className="text-white/35 text-sm">
                      <span suppressHydrationWarning>{t('library.noContributions')}</span>
                    </p>
                    <Link href="/contribute" className="text-xs text-blue-400 hover:text-blue-300 underline transition-colors">
                      <span suppressHydrationWarning>{t('library.ctaButton')}</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {DIVISION_KEYS.map(key => (
                      <DivisionSection key={key} divisionKey={key} submissions={byDivision[key] ?? []} t={t} sectionRef={divisionRefs.current[key]} />
                    ))}
                  </div>
                )}
              </div>

              {/* ── Desktop sidebar ── */}
              <aside className="hidden lg:block w-60 shrink-0 sticky top-24">
                <DesktopSidebar
                  query={activeQuery}
                  inputValue={inputValue}
                  onInput={setInputValue}
                  onSearch={handleSearch}
                  onScrollTo={scrollTo}
                  t={t}
                />
              </aside>

            </div>
          </div>
        )}
      </div>

      {/* ── Silent background refresh indicator ── */}
      {refreshing && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 text-[10px] text-white/40 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-pulse" />
          Refreshing…
        </div>
      )}
    </div>
  );
};

export default LibraryPage;