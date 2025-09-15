import React, { useState } from 'react'
import { useTranslation } from '@/i18n/TranslationProvider'
import SendInviteButton from '@/components/button/SendInviteButton'

// TODO: replace with actual SendInviteButton component once created
const TempSendButton: React.FC<{ loading: boolean; onClick: () => void; disabled?: boolean }> = ({ loading, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className="h-12 px-6 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? 'Sending...' : 'Send Invite'}
  </button>
)

const InviteContributors: React.FC = () => {
  const { t, locale } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bacway.dz'
  const inviteLink = `${appUrl}/signup?ref=invite`

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value)

  const handleSend = async () => {
    setMessage(null)
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.')
      return
    }
    try {
      setLoading(true)
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) {
        const diagnosticParts: string[] = []
        if (data.code) diagnosticParts.push(`[${data.code}]`)
        if (data.error) diagnosticParts.push(data.error)
        if (data.hint) diagnosticParts.push(data.hint)
        if (data.reason) diagnosticParts.push(data.reason)
        if (data.exception) diagnosticParts.push(data.exception)
        const diagnostic = diagnosticParts.join(' • ')
        throw new Error(diagnostic || 'Failed')
      }
      setMessage('Invitation email sent!')
      setEmail('')
    } catch (e: any) {
      setMessage(e.message || 'Failed to send invite. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 2500)
    } catch {
      // fallback
      setMessage('Copy failed. Manually select the link.')
    }
  }

  return (
    <section className="w-full py-16" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="space-y-10">
          {/* Heading & Intro */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Invite a Contributor
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base max-w-2xl">
              If you know a student who has valuable resources, invite them to join the hub.<br />
              Enter an email and we'll send them a personal invite ✉️
            </p>
          </div>

          {/* Email Form */}
          <div className="bg-[#111418] border border-white/10 rounded-xl p-6 md:p-8 shadow-inner">
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="contributor@example.com"
                  className="w-full h-12 rounded-md bg-black/40 border border-white/15 focus:border-white/40 focus:outline-none px-4 text-white placeholder-gray-500 font-medium"
                />
              </div>
              <SendInviteButton loading={loading} onClick={handleSend} disabled={!email} />
            </div>
            {message && (
              <p className="mt-3 text-sm text-gray-400">{message}</p>
            )}
            <p className="mt-6 text-xs text-gray-500">
              We’ll only use this to send one invitation. They won’t be subscribed to anything.
            </p>
          </div>

          {/* Shareable Link */}
          <div className="bg-[#0F1417] rounded-xl border border-white/10 p-6 md:p-8">
            <p className="text-gray-300 text-sm md:text-base mb-4 leading-relaxed">
              Prefer to send it yourself? Copy this custom invite link and send it via WhatsApp, Messenger, or Instagram DMs.
            </p>

            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              <div className="flex-1">
                <div className="w-full h-12 rounded-md bg-black/40 border border-white/15 px-4 flex items-center text-white text-sm overflow-x-auto">
                  {inviteLink}
                </div>
              </div>
              <button
                onClick={handleCopy}
                className={`h-12 px-6 rounded-md font-semibold transition text-sm md:text-base ${copyStatus === 'copied' ? 'bg-emerald-600 hover:bg-emerald-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
              >
                {copyStatus === 'copied' ? 'Copied!' : 'Copy Invitation'}
              </button>
            </div>
          </div>

          {/* Future: Email Template Preview Placeholder */}
          <div className="border border-dashed border-white/10 rounded-lg p-6 text-gray-500 text-sm">
            Email template preview component will go here (coming next).
          </div>
        </div>
      </div>
    </section>
  )
}

export default InviteContributors