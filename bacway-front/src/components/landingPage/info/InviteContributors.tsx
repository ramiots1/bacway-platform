"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/i18n/TranslationProvider';

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = 'idle' | 'loading' | 'success' | 'error';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isValidEmail = (v: string) => /\S+@\S+\.\S+/.test(v);

const MIN_NOTE_LENGTH = 20;

// ─── Main Component ───────────────────────────────────────────────────────────

const InviteContributors: React.FC = () => {
  const { t, locale } = useTranslation();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const [email,  setEmail]  = useState('');
  const [note,   setNote]   = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errMsg, setErrMsg] = useState('');

  const canSubmit = isValidEmail(email) && note.length >= MIN_NOTE_LENGTH && status !== 'loading';

  const handleSend = async () => {
    if (!canSubmit) return;

    setStatus('loading');
    setErrMsg('');

    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email, message: note }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to send');

      setStatus('success');
      setEmail('');
      setNote('');
    } catch (err: any) {
      setErrMsg(err.message ?? 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <section className="w-full py-10 flex flex-col items-center text-center mb-20">
      <div className="w-full max-w-xl px-4 mx-auto space-y-8">

        {/* ── Heading ── */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {t('invite.title')}
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-mx mx-auto">
            {t('invite.introLine1')}
            <br />
            {t('invite.introLine2')}
          </p>
        </div>

        {/* ── Form ── */}
        <div className="flex flex-col gap-3" dir={dir}>

          {/* Email input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('invite.emailPlaceholder') || 'Their Contact'}
            className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white text-white placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors duration-200 text-sm"
          />

          {/* Message textarea + character counter */}
          <div className="relative">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('invite.notePlaceholder') || 'Tell us about them'}
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white text-white placeholder-white/40 focus:outline-none focus:border-blue-500 transition-colors duration-200 text-sm resize-none"
            />
            <span className={`absolute bottom-3 right-3 text-xs transition duration-200 ${
              note.length >= MIN_NOTE_LENGTH ? 'opacity-0 transition-opacity duration-200 text-white/30' : 'text-white/30 opacity-100'
            }`}>
              Write at least 20 characters: {note.length}/{MIN_NOTE_LENGTH}
            </span>
          </div>

          {/* Error message */}
          {status === 'error' && (
            <p className="text-red-400 text-xs text-left">{errMsg}</p>
          )}

          {/* Send button */}
          <div className="flex justify-end gap-6 items-center">
                {/* Success message */}
                {status === 'success' && (
                    <p className="text-white-400 text-xs text-left">
                    {t('invite.successMessage') || 'Invitation sent successfully!'}
                    </p>
                )}
            <button
              onClick={handleSend}
              disabled={!canSubmit}
              className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors duration-200"
            >
              {status === 'loading'
                ? (t('invite.sending') || 'Sending…')
                : (t('invite.sendButton') || 'Send invite')}
            </button>
            
          </div>

        </div>

        {/* ── Fine print ── */}
        <p className="text-xs text-blue-200/50">
          {t('invite.emailNote')}
        </p>

      </div>
    </section>
  );
};

export default InviteContributors;