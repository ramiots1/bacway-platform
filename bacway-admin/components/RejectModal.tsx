'use client'
import { useState } from 'react'

interface RejectModalProps {
  type?: 'contribution' | 'letter'
  onConfirm: (reason: string) => void
  onCancel: () => void
}

const QUICK_REASONS = [
  'Files are incomplete or inaccessible via the Drive link.',
  'Content does not meet our quality standards.',
  'Description is too vague — please provide more detail.',
  'Duplicate submission already exists in the library.',
  'Letter is too short and lacks actionable advice.',
]

export function RejectModal({ type = 'contribution', onConfirm, onCancel }: RejectModalProps) {
  const [reason, setReason] = useState('')

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="rounded-2xl w-full max-w-lg border"
        style={{ background: '#111', borderColor: '#222' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: '#1a1a1a' }}>
          <div>
            <h3 className="text-white font-semibold">Reject {type === 'letter' ? 'Letter' : 'Contribution'}</h3>
            <p className="text-xs mt-0.5" style={{ color: '#555' }}>
              Your reason will be emailed to the contributor automatically.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-sm"
            style={{ background: '#1a1a1a', color: '#666' }}
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Quick reasons */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-2.5" style={{ color: '#444' }}>Quick reasons</p>
            <div className="space-y-1.5">
              {QUICK_REASONS.map(r => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all"
                  style={{
                    background: reason === r ? '#ef444415' : '#161616',
                    color: reason === r ? '#ef4444' : '#666',
                    border: `1px solid ${reason === r ? '#ef444430' : 'transparent'}`,
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Custom reason */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest mb-2.5" style={{ color: '#444' }}>Custom message</p>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Or write a custom rejection reason..."
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm text-white resize-none outline-none transition-all"
              style={{ background: '#161616', border: '1px solid #2a2a2a', caretColor: '#ef4444' }}
              onFocus={e => (e.target.style.borderColor = '#ef444450')}
              onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
            />
          </div>

          {/* Email preview */}
          {reason && (
            <div className="rounded-xl p-4" style={{ background: '#0f0f0f', border: '1px solid #1a1a1a' }}>
              <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#444' }}>📧 Email preview</p>
              <p className="text-xs leading-relaxed" style={{ color: '#777' }}>
                <span style={{ color: '#555' }}>To:</span> contributor@example.com<br />
                <span style={{ color: '#555' }}>Subject:</span> Update on your BACWAY submission<br />
                <br />
                Thank you for your submission to BACWAY. Unfortunately, we were unable to accept it at this time.<br />
                <br />
                <span style={{ color: '#aaa' }}><strong>Reason:</strong> {reason}</span><br />
                <br />
                You&apos;re welcome to make the necessary adjustments and re-submit. We appreciate your contribution to the BAC community.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
            style={{ background: '#1a1a1a', color: '#666' }}
          >
            Cancel
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim()}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
            style={{ background: '#ef4444', color: '#fff' }}
          >
            Send Rejection ✕
          </button>
        </div>
      </div>
    </div>
  )
}
