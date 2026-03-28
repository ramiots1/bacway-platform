import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

const buildNotificationHtml = (submittedEmail: string, message: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contributor Suggestion</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; background: #0C1114; color: #fff; padding: 20px 0; }
    .container { max-width: 560px; margin: 0 auto; background: #111418; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
    .header { background: #0C1114; padding: 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .logo { font-size: 24px; font-weight: 700; color: #fff; }
    .badge { display: inline-block; margin-top: 8px; background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); color: #3b82f6; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px; letter-spacing: 0.5px; }
    .body { padding: 36px 40px; }
    .title { font-size: 20px; font-weight: 600; margin-bottom: 24px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.4); margin-bottom: 6px; }
    .value-box { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; font-size: 15px; color: rgba(255,255,255,0.85); line-height: 1.6; word-break: break-word; }
    .email-value { color: #3b82f6; font-weight: 600; }
    .footer { background: #0C1114; padding: 20px 40px; border-top: 1px solid rgba(255,255,255,0.08); text-align: center; font-size: 12px; color: rgba(255,255,255,0.3); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NEW CONTRIBUTOR SUGGESTION</div>
    </div>
    <div class="body">
      <h1 class="title">Someone wants to invite a contributor 👋</h1>

      <div class="label">Their contact email</div>
      <div class="value-box email-value">${submittedEmail}</div>

      <div class="label">About them</div>
      <div class="value-box">${message}</div>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Bacway · This is an automated admin notification
    </div>
  </div>
</body>
</html>
`

export async function POST(req: NextRequest) {
  try {
    const { to, message } = await req.json()

    if (!to || !/\S+@\S+\.\S+/.test(to)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (!message || message.trim().length < 20) {
      return NextResponse.json({ error: 'Message too short' }, { status: 400 })
    }

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to:   process.env.MAIL_USER,        // ← sends to YOU, not the submitted email
      replyTo: to,                         // ← reply goes directly to the suggested person
      subject: `New contributor suggestion: ${to}`,
      html: buildNotificationHtml(to, message),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[invite] mail error:', err)
    return NextResponse.json({ error: err.message ?? 'Failed to send' }, { status: 500 })
  }
}