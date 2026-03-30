"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import upShadowColorful from '@/assets/artboardHero/upShadowColorful.png';
import { useTranslation } from '@/i18n/TranslationProvider';

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode   = 'contribute' | 'letter';
type Status = 'idle' | 'loading' | 'success' | 'error';

interface PersonalInfo {
  fullName:  string;
  email:     string;
  bacYear:   string;
  grade:     string;
  division:  string;
}

interface ContactRow { platform: string; handle: string }
interface DriveRow   { name: string; url: string; description: string }

// ─── Constants ────────────────────────────────────────────────────────────────

const PLATFORM_KEYS = ['Instagram', 'Facebook', 'LinkedIn', 'Other'] as const;
const DIVISION_KEYS = [
  'mathematics', 'science', 'technicalMath',
  'management',  'languages', 'literature',
] as const;

const MAX_CONTACTS    = 3;
const MAX_DRIVES      = 4;
const MIN_LETTER_CHARS = 500;

const EMPTY_CONTACT = (): ContactRow => ({ platform: 'Instagram', handle: '' });
const EMPTY_DRIVE   = (): DriveRow   => ({ name: '', url: '', description: '' });
const EMPTY_INFO: PersonalInfo = { fullName: '', email: '', bacYear: '', grade: '', division: '' };

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputCls  = "w-full border rounded-s border-white/30 text-white text-sm px-3 py-2.5 placeholder-white/20 focus:outline-none focus:border-white/70 transition-colors duration-150";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

// ─── Sub-components ───────────────────────────────────────────────────────────

const Label: React.FC<{ text: string; required?: boolean }> = ({ text, required }) => (
  <p className="text-[12px] text-white mb-1.5 font-normal">
    {text}{required && <span className="text-blue-400 ml-0.5">*</span>}
  </p>
);

const Section: React.FC<{
  title:     string;
  subtitle?: string;
  action?:   React.ReactNode;
  children:  React.ReactNode;
}> = ({ title, subtitle, action, children }) => (
  <div className="border-x border-white/30 bg-[rgb(12,17,20)]">
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/30">
      <div>
        <p className="text-white text-sm font-semibold leading-tight">{title}</p>
        {subtitle && <p className="text-white/35 text-xs mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
    <div className="p-5 space-y-3">{children}</div>
  </div>
);

// ─── Success Screen ───────────────────────────────────────────────────────────

const SuccessScreen: React.FC<{
  mode:    Mode;
  name:    string;
  email:   string;
  onReset: () => void;
  t:       (key: string) => string;
}> = ({ mode, name, email, onReset, t }) => (
  <div className="min-h-180 flex flex-col items-center relative justify-center text-center px-4 gap-8">
    <Image src="/libraryCat.svg" alt="Bacway" width={300} height={300} />
    <div className="space-y-3 relative z-10 max-w-md">
      <h1 className="text-3xl md:text-4xl font-bold text-white">
        {mode === 'contribute' ? t('contribute.success.titleContribute') : t('contribute.success.titleLetter')}
      </h1>
      <p className="text-white/55 text-base leading-relaxed">
        {t('contribute.success.thankYou')
          .replace('{name}', name)
          .replace('{type}', mode === 'contribute'
            ? t('contribute.success.typeContribution')
            : t('contribute.success.typeLetter')
          )}
      </p>
      <p className="text-white/35 text-sm">
        {t('contribute.success.getBack')}{' '}
        <strong className="text-blue-400">{email}</strong>{' '}
        {t('contribute.success.onceReviewed')}
      </p>
    </div>
    <div className="flex relative z-10 gap-3">
      <button onClick={onReset} className="px-6 py-2.5 border rounded-lg border-white/20 text-white text-sm hover:bg-white/5 transition-colors">
        {t('contribute.success.submitAnother')}
      </button>
      <Link href="/library" className="px-6 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
        {t('contribute.success.browseLibrary')}
      </Link>
    </div>
    <Image src={upShadowColorful} alt="" fill className="object-bottom opacity-50 -z-0" priority={false} />
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const ContributePage: React.FC = () => {
  const { t } = useTranslation();

  const [mode,     setMode]     = useState<Mode>('contribute');
  const [status,   setStatus]   = useState<Status>('success');
  const [errMsg,   setErrMsg]   = useState('');
  const [info,     setInfo]     = useState<PersonalInfo>(EMPTY_INFO);
  const [contacts, setContacts] = useState<ContactRow[]>([EMPTY_CONTACT()]);
  const [drives,   setDrives]   = useState<DriveRow[]>([EMPTY_DRIVE()]);
  const [letter,   setLetter]   = useState('');
  const [picture,  setPicture]  = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Field updaters ───────────────────────────────────────────────────────────

  const setField = (key: keyof PersonalInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setInfo(p => ({ ...p, [key]: e.target.value }));

  const updateContact = (i: number, key: keyof ContactRow, val: string) =>
    setContacts(p => p.map((c, idx) => idx === i ? { ...c, [key]: val } : c));

  const updateDrive = (i: number, key: keyof DriveRow, val: string) =>
    setDrives(p => p.map((d, idx) => idx === i ? { ...d, [key]: val } : d));

  // ── Actions ──────────────────────────────────────────────────────────────────

  const addContact    = () => contacts.length < MAX_CONTACTS && setContacts(p => [...p, EMPTY_CONTACT()]);
  const removeContact = (i: number) => setContacts(p => p.filter((_, idx) => idx !== i));
  const addDrive      = () => drives.length < MAX_DRIVES && setDrives(p => [...p, EMPTY_DRIVE()]);
  const removeDrive   = (i: number) => drives.length > 1 && setDrives(p => p.filter((_, idx) => idx !== i));

  const reset = () => {
    setStatus('idle'); setInfo(EMPTY_INFO);
    setContacts([EMPTY_CONTACT()]); setDrives([EMPTY_DRIVE()]);
    setLetter(''); setPicture(null); setMode('contribute');
  };

  const isValid = () => {
    if (!info.fullName.trim() || !info.email.trim() || !info.bacYear.trim() || !info.division) return false;
    if (mode === 'letter' && letter.length < MIN_LETTER_CHARS) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!isValid() || status === 'loading') return;
    setStatus('loading'); setErrMsg('');
    try {
      const body = new FormData();
      body.append('mode',     mode);
      body.append('info',     JSON.stringify(info));
      body.append('contacts', JSON.stringify(contacts.filter(c => c.handle.trim())));
      if (mode === 'contribute') {
        body.append('drives', JSON.stringify(drives.filter(d => d.url.trim())));
      } else {
        body.append('letter', letter);
        if (picture) body.append('picture', picture);
      }
      const res  = await fetch('/api/contribute', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Submission failed');
      setStatus('success');
    } catch (err: any) {
      setErrMsg(err.message ?? 'Something went wrong');
      setStatus('error');
    }
  };

  // ── Success ──────────────────────────────────────────────────────────────────

  if (status === 'success') {
    return <SuccessScreen mode={mode} name={info.fullName} email={info.email} onReset={reset} t={t} />;
  }

  // ── Form ─────────────────────────────────────────────────────────────────────

  return (
    <div className=" min-h-screen py-24 mx-0 flex flex-col items-center bg-[#0C1114]">

      {/* Hero */}
      <div className="relative w-full flex flex-col items-center text-center gap-5 pb-12 mt-7 mx-8">
        <Image src="/bacwayBadge.svg" alt="Bacway" width={150} height={150} />
        <div className="relative z-1 flex flex-col items-center space-y-3 mx-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            <span suppressHydrationWarning>{t('contribute.hero.title')}</span>
          </h1>
          <p className="text-white font-light text-sm max-w-md leading-relaxed">
            <span suppressHydrationWarning>{t('contribute.hero.subtitle')}</span>
          </p>
          
        </div>
        <Image
                src={upShadowColorful}
                alt="Bacway Shadow Decoration"
                fill
                className='object-bottom relative opacity-50 -z-0'
                priority={false}
        />
      </div>
      
      {/* ── Personal Information ── */}
      <div className=" relative w-full border-t bg-[#0C1114] border-white/40 flex flex-col items-center">
        <div className="w-full px-5 max-w-2xl">
          <Section title={t('contribute.personal.title')}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label text={t('contribute.personal.fullName')} required />
                <input value={info.fullName} onChange={setField('fullName')} placeholder={t('contribute.personal.fullNamePlaceholder')} className={inputCls} />
              </div>
              <div>
                <Label text={t('contribute.personal.email')} required />
                <input type="email" value={info.email} onChange={setField('email')} placeholder={t('contribute.personal.emailPlaceholder')} className={inputCls} />
              </div>
              <div>
                <Label text={t('contribute.personal.bacYear')} required />
                <input value={info.bacYear} onChange={setField('bacYear')} placeholder={t('contribute.personal.bacYearPlaceholder')} className={inputCls} />
              </div>
              <div>
                <Label text={t('contribute.personal.grade')} />
                <input value={info.grade} onChange={setField('grade')} placeholder={t('contribute.personal.gradePlaceholder')} className={inputCls} />
              </div>
            </div>
            <div>
              <Label text={t('contribute.personal.division')} required />
              <select value={info.division} onChange={setField('division')} className={selectCls}>
                <option value="" disabled>{t('contribute.personal.divisionPlaceholder')}</option>
                {DIVISION_KEYS.map(key => (
                  <option key={key} value={key}>
                    {t(`library.divisions.${key}`)}
                  </option>
                ))}
              </select>
            </div>
          </Section>
        </div>
      </div>

      {/* ── Contact Information ── */}
      <div className=" relative w-full border-t bg-[#0C1114] border-white/40 flex flex-col items-center">
        <div className="w-full px-5 max-w-2xl">
          <Section
            title={t('contribute.contact.title')}
            subtitle={t('contribute.contact.subtitle')}
            action={
              contacts.length < MAX_CONTACTS
                ? <button onClick={addContact} className="text-xs text-white/50 hover:text-white transition-colors rounded-lg border p-1 px-2 border-white/50">{t('contribute.contact.add')}</button>
                : null
            }
          >
            {contacts.map((c, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select value={c.platform} onChange={e => updateContact(i, 'platform', e.target.value)} className={`${selectCls} flex-1/3`}>
                  {PLATFORM_KEYS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input value={c.handle} onChange={e => updateContact(i, 'handle', e.target.value)} placeholder={t('contribute.contact.handlePlaceholder')} className={inputCls} />
                {contacts.length > 1 && (
                  <button onClick={() => removeContact(i)} className="text-white/50 hover:text-red-400 text-xl leading-none transition-colors shrink-0 pb-0.5">×</button>
                )}
              </div>
            ))}
          </Section>
        </div>
      </div>

      {/* ── Mode Toggle ── */}
      <div className="w-full border-t border-white/40 flex flex-col items-center">
        <div className="w-full px-5 max-w-2xl">
          <div className="flex border-x border-white/30">
            {(['contribute', 'letter'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 text-sm font-medium transition-all duration-200 ${
                  mode === m ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <span suppressHydrationWarning>
                  {m === 'contribute' ? t('contribute.mode.contribute') : t('contribute.mode.letter')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contribute: Drive Links ── */}
      {mode === 'contribute' && (
        <div className="w-full border-y border-white/40 flex flex-col items-center">
          <div className="w-full px-5 max-w-2xl">
            <Section
              title={t('contribute.drives.title')}
              subtitle={t('contribute.drives.subtitle')}
              action={
                drives.length < MAX_DRIVES
                  ? <button onClick={addDrive} className="text-xs text-white/50 hover:text-white transition-colors rounded-lg border p-1 px-2 border-white/50">
                      {t('contribute.drives.add')}
                    </button>
                  : <span className="text-xs text-white/20">{t('contribute.drives.maxReached')}</span>
              }
            >
              {drives.map((d, i) => (
                <div key={i} className="space-y-2">
                  {drives.length > 1 && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/25">#{i + 1}</span>
                      <button onClick={() => removeDrive(i)} className="text-xs text-white/20 hover:text-red-400 transition-colors">
                        {t('contribute.drives.remove')}
                      </button>
                    </div>
                  )}
                  <input value={d.name} onChange={e => updateDrive(i, 'name', e.target.value)} placeholder={t('contribute.drives.namePlaceholder')} className={inputCls} />
                  <input value={d.url}  onChange={e => updateDrive(i, 'url',  e.target.value)} placeholder={t('contribute.drives.urlPlaceholder')} className={inputCls} />
                  <textarea value={d.description} onChange={e => updateDrive(i, 'description', e.target.value)} placeholder={t('contribute.drives.descriptionPlaceholder')} rows={3} className={`${inputCls} resize-none`} />
                  {i < drives.length - 1 && <div className="border-t border-white/5 mt-1" />}
                </div>
              ))}
            </Section>
          </div>
        </div>
      )}

      {/* ── Letter mode ── */}
      {mode === 'letter' && (
        <>
          <div className="w-full border-y border-white/40 flex flex-col items-center">
            <div className="w-full px-5 max-w-2xl">
              <Section title={t('contribute.picture.title')} subtitle={t('contribute.picture.subtitle')}>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => setPicture(e.target.files?.[0] ?? null)} />
                <button onClick={() => fileRef.current?.click()} className={`${inputCls} text-center ${picture ? 'text-white' : 'text-white/20'}`}>
                  {picture ? picture.name : t('contribute.picture.upload')}
                </button>
                {picture && <p className="text-xs text-white/25 mt-1">{(picture.size / 1024 / 1024).toFixed(2)} MB</p>}
              </Section>
            </div>
          </div>

          <div className="w-full border-b border-white/40 flex flex-col items-center">
            <div className="w-full px-5 max-w-2xl">
              <Section title={t('contribute.letter.title')} subtitle={t('contribute.letter.subtitle')}>
                <div className="relative">
                  <textarea
                    value={letter}
                    onChange={e => setLetter(e.target.value)}
                    placeholder={t('contribute.letter.placeholder')}
                    rows={9}
                    className={`${inputCls} resize-none pb-8`}
                  />
                  <span className={`absolute bottom-3 right-3 text-xs transition-colors duration-200 ${
                    letter.length >= MIN_LETTER_CHARS ? 'text-green-400' : 'text-white/20'
                  }`}>
                    {letter.length}/{MIN_LETTER_CHARS} {t('contribute.letter.characters')}
                  </span>
                </div>
              </Section>
            </div>
          </div>
        </>
      )}

      {/* ── Error ── */}
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-3">{errMsg}</p>
      )}

      {/* ── Submit ── */}
      <div className="flex flex-col items-center gap-3 pt-6 pb-10">
        <button
          onClick={handleSubmit}
          disabled={!isValid() || status === 'loading'}
          className="px-12 py-3 bg-blue-500 text-white rounded-lg font-normal text-sm disabled:bg-gray-400 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          <span suppressHydrationWarning>
            {status === 'loading'
              ? t('contribute.submit.loading')
              : mode === 'contribute'
                ? t('contribute.submit.contribute')
                : t('contribute.submit.letter')}
          </span>
        </button>
        <p className="text-white/40 text-xs text-center px-10 max-w-sm">
          <span suppressHydrationWarning>{t('contribute.submit.note')}</span>
        </p>
      </div>

    </div>
  );
};

export default ContributePage;