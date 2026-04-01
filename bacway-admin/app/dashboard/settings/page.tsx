'use client'
import { useState } from 'react'
import { DIVISIONS } from '@/lib/data'

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: '#111', borderColor: '#1e1e1e' }}>
      <div className="px-6 py-5 border-b" style={{ borderColor: '#1a1a1a' }}>
        <h2 className="text-white font-semibold text-sm">{title}</h2>
        <p className="text-xs mt-0.5" style={{ color: '#555' }}>{description}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

function Toggle({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b last:border-0" style={{ borderColor: '#1a1a1a' }}>
      <div>
        <p className="text-sm text-white">{label}</p>
        <p className="text-xs mt-0.5" style={{ color: '#555' }}>{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className="flex-shrink-0 w-11 h-6 rounded-full transition-all duration-200 relative"
        style={{ background: value ? '#00c8ff' : '#222' }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200"
          style={{ background: '#fff', left: value ? '22px' : '2px' }}
        />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [pinError, setPinError] = useState('')

  const [emailSettings, setEmailSettings] = useState({
    sendOnAccept: true,
    sendOnReject: true,
    senderName: 'BACWAY Team',
    senderEmail: 'noreply@bacway.dz',
    replyTo: 'contact@bacway.dz',
  })

  const [toggles, setToggles] = useState({
    autoArchive: false,
    requireDriveLink: true,
    allowResubmit: true,
    maintenanceMode: false,
  })

  const [emailTemplate, setEmailTemplate] = useState(
    `Bonjour {name},\n\nMerci pour votre soumission à BACWAY. Malheureusement, nous ne pouvons pas l'accepter pour le moment.\n\nRaison : {reason}\n\nVous êtes les bienvenus pour corriger et soumettre à nouveau. Nous apprécions votre contribution à la communauté BAC.\n\nCordialement,\nL'équipe BACWAY`
  )

  const handleSavePin = () => {
    if (pin.length < 4) { setPinError('PIN must be at least 4 characters'); return }
    if (pin !== confirmPin) { setPinError('PINs do not match'); return }
    setPinError('')
    localStorage.setItem('bw_admin_pin', pin)
    setPin('')
    setConfirmPin('')
    flashSaved()
  }

  const flashSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-5">
      <div className="mb-7">
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-sm mt-1" style={{ color: '#555' }}>Configure your BACWAY admin panel preferences</p>
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium" style={{ background: '#10b981', color: '#fff', boxShadow: '0 10px 30px #10b98150' }}>
          ✓ Settings saved
        </div>
      )}

      {/* Security */}
      <Section title="Security" description="Change your admin panel PIN">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#444' }}>New PIN</label>
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="Enter new PIN"
              className="w-full max-w-xs px-4 py-2.5 rounded-xl text-sm text-white outline-none"
              style={{ background: '#161616', border: '1px solid #2a2a2a' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#444' }}>Confirm PIN</label>
            <input
              type="password"
              value={confirmPin}
              onChange={e => setConfirmPin(e.target.value)}
              placeholder="Confirm new PIN"
              className="w-full max-w-xs px-4 py-2.5 rounded-xl text-sm text-white outline-none"
              style={{ background: '#161616', border: '1px solid #2a2a2a' }}
            />
          </div>
          {pinError && <p className="text-xs text-red-400">{pinError}</p>}
          <button
            onClick={handleSavePin}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
            style={{ background: '#00c8ff', color: '#000' }}
          >
            Update PIN
          </button>
        </div>
      </Section>

      {/* Email settings */}
      <Section title="Email Notifications" description="Configure automated emails sent to contributors">
        <div className="space-y-4">
          <Toggle
            label="Send email on acceptance"
            description="Notify contributors when their submission is accepted"
            value={emailSettings.sendOnAccept}
            onChange={v => setEmailSettings(s => ({ ...s, sendOnAccept: v }))}
          />
          <Toggle
            label="Send email on rejection"
            description="Notify contributors when their submission is rejected with a reason"
            value={emailSettings.sendOnReject}
            onChange={v => setEmailSettings(s => ({ ...s, sendOnReject: v }))}
          />

          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { label: 'Sender Name', key: 'senderName' as const },
              { label: 'Sender Email', key: 'senderEmail' as const },
              { label: 'Reply-To Email', key: 'replyTo' as const },
            ].map(f => (
              <div key={f.key} className={f.key === 'replyTo' ? 'col-span-2' : ''}>
                <label className="block text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#444' }}>{f.label}</label>
                <input
                  value={emailSettings[f.key]}
                  onChange={e => setEmailSettings(s => ({ ...s, [f.key]: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none"
                  style={{ background: '#161616', border: '1px solid #2a2a2a' }}
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Email template */}
      <Section title="Rejection Email Template" description="Customize the email sent to contributors when their submission is rejected. Use {name} and {reason} as placeholders.">
        <div className="space-y-3">
          <textarea
            value={emailTemplate}
            onChange={e => setEmailTemplate(e.target.value)}
            rows={8}
            className="w-full rounded-xl px-4 py-3 text-sm text-white resize-none outline-none font-mono"
            style={{ background: '#161616', border: '1px solid #2a2a2a', lineHeight: 1.6 }}
          />
          <div className="flex items-center gap-2 text-xs" style={{ color: '#444' }}>
            <span>Available placeholders:</span>
            {['{name}', '{reason}', '{division}', '{year}'].map(p => (
              <span key={p} className="px-2 py-0.5 rounded-md font-mono" style={{ background: '#1a1a1a', color: '#00c8ff' }}>{p}</span>
            ))}
          </div>
        </div>
      </Section>

      {/* Platform behaviour */}
      <Section title="Platform Behaviour" description="Control how submissions are handled">
        <div>
          <Toggle
            label="Auto-archive on acceptance"
            description="Automatically add accepted contributions to the library without a second confirmation"
            value={toggles.autoArchive}
            onChange={v => setToggles(s => ({ ...s, autoArchive: v }))}
          />
          <Toggle
            label="Require Drive link"
            description="Contributors must provide a Google Drive link in their submission"
            value={toggles.requireDriveLink}
            onChange={v => setToggles(s => ({ ...s, requireDriveLink: v }))}
          />
          <Toggle
            label="Allow re-submission"
            description="Contributors can re-submit after a rejection"
            value={toggles.allowResubmit}
            onChange={v => setToggles(s => ({ ...s, allowResubmit: v }))}
          />
          <Toggle
            label="Maintenance mode"
            description="Temporarily disable the public site while keeping the admin panel accessible"
            value={toggles.maintenanceMode}
            onChange={v => setToggles(s => ({ ...s, maintenanceMode: v }))}
          />
        </div>
      </Section>

      {/* Active Divisions */}
      <Section title="Active Divisions" description="Divisions currently visible in the library">
        <div className="flex flex-wrap gap-2">
          {DIVISIONS.map(d => (
            <span key={d} className="px-3 py-1.5 rounded-xl text-xs font-medium" style={{ background: '#00c8ff12', color: '#00c8ff', border: '1px solid #00c8ff25' }}>
              {d}
            </span>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: '#444' }}>
          Division management coming in a future update.
        </p>
      </Section>

      {/* Save button */}
      <div className="flex justify-end pb-8">
        <button
          onClick={flashSaved}
          className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: '#00c8ff', color: '#000' }}
        >
          Save All Settings
        </button>
      </div>
    </div>
  )
}
