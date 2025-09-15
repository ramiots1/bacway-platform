import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import InviteEmailTemplate from '@/components/email/InviteEmailTemplate'

// Force node runtime (Resend requires Node, not edge)
export const runtime = 'nodejs'

// Basic in-memory rate limiter (per process). For multi-instance deployments, replace with Redis.
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = 5 // max emails per IP per window
const ipBuckets: Record<string, { count: number; reset: number }> = {}

// Email & domain validation
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

// Helper: rate limit check
function checkRateLimit(ip: string | undefined): { allowed: boolean; retryAfter?: number } {
  if (!ip) return { allowed: true }
  const now = Date.now()
  const bucket = ipBuckets[ip]
  if (!bucket || now > bucket.reset) {
    ipBuckets[ip] = { count: 1, reset: now + RATE_LIMIT_WINDOW_MS }
    return { allowed: true }
  }
  bucket.count += 1
  if (bucket.count > RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((bucket.reset - now) / 1000) }
  }
  return { allowed: true }
}

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed', code: 'method_not_allowed' }, { status: 405 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const rate = checkRateLimit(ip)
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again later.', code: 'rate_limited', retryAfter: rate.retryAfter },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } }
    )
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body', code: 'invalid_json' }, { status: 400 })
  }

  const email = (body?.email || '').trim()
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Invalid email', code: 'invalid_email' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bacway.dz'
  const from = process.env.INVITE_FROM_EMAIL || 'Bacway <noreply@bacway.dz>'
  const resendKey = process.env.RESEND_API_KEY

  if (!resendKey) {
    return NextResponse.json({ error: 'Email service not configured (missing key)', code: 'not_configured' }, { status: 503 })
  }

  const resend = new Resend(resendKey)
  const inviteLink = `${appUrl}/signup?ref=invite&email=${encodeURIComponent(email)}`

  try {
    // Basic sanity: ensure from includes domain part
    if (!/^[^<]*<[^>]+@[^>]+>$/.test(from) && !/^[^@]+@[^@]+\.[^@]+$/.test(from)) {
      return NextResponse.json({ error: 'Invalid FROM format', code: 'invalid_from_format', detail: from }, { status: 400 })
    }

    const start = Date.now()
    // Prefer plain HTML to avoid requiring @react-email/render in this minimal setup
    const html = `<!doctype html><html><body style="margin:0;padding:0;background:#f5f7fa;">
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f5f7fa;padding:24px;color:#111;">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:10px;padding:32px;border:1px solid #e2e8f0;">
          <h1 style="font-size:22px;margin:0 0 16px;font-weight:700;">You're Invited to Bacway</h1>
          <p style="line-height:1.55;font-size:15px;margin:0 0 16px;">Someone thinks you have valuable resources to share with students preparing for the BAC. Bacway is a collaborative hub where top students and teachers contribute notes, past papers, explanations, and structured study material.</p>
          <p style="line-height:1.55;font-size:15px;margin:0 0 16px;">This invitation was sent to <strong>${email}</strong>.</p>
          <p style="line-height:1.55;font-size:15px;margin:0 0 24px;">Click the button below to create your account and start contributing:</p>
          <p style="text-align:center;margin:0 0 32px;">
            <a href="${inviteLink}" style="background:linear-gradient(90deg,#2563eb,#7c3aed);color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;display:inline-block;font-size:15px;">Accept Invitation</a>
          </p>
          <p style="font-size:13px;color:#555;line-height:1.5;">If the button doesn't work, copy and paste this link in your browser:<br /><span style="word-break:break-all;color:#2563eb;">${inviteLink}</span></p>
          <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />
          <p style="font-size:12px;color:#666;">You received this because someone submitted your email to invite you to Bacway. If you believe this was a mistake, you can ignore it.</p>
          <p style="font-size:12px;color:#999;margin-top:8px;">© ${new Date().getFullYear()} Bacway. All rights reserved.</p>
        </div>
      </div>
    </body></html>`

    const { data, error } = await resend.emails.send({
      from,
      to: email,
      subject: 'Your Invitation to Join Bacway',
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      // Expose limited diagnostic hint without leaking sensitive internals
      return NextResponse.json({ 
        error: 'Failed to send email',
        code: 'provider_error',
        hint: error?.name || error?.code || 'unknown_error',
        reason: error?.message?.substring(0,180)
      }, { status: 502 })
    }

    const durationMs = Date.now() - start
    return NextResponse.json({ success: true, code: 'sent', id: data?.id, inviteLink, durationMs })
  } catch (e: any) {
    console.error('Invite send exception:', e)
    return NextResponse.json({ error: 'Server error while sending email', code: 'unhandled_exception', exception: e?.message?.substring(0,180) }, { status: 500 })
  }
}

// Optional: HEAD route for health checks
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
