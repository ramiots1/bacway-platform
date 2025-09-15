import React from 'react'

interface InviteEmailTemplateProps {
  inviteeEmail: string
  inviteLink: string
}

// Basic HTML email-safe layout (avoid Tailwind classes in actual sending; inline styles or simple table structure recommended for production)
const InviteEmailTemplate: React.FC<InviteEmailTemplateProps> = ({ inviteeEmail, inviteLink }) => {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', background: '#f5f7fa', padding: '24px', color: '#111' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', background: '#ffffff', borderRadius: '10px', padding: '32px', border: '1px solid #e2e8f0' }}>
        <h1 style={{ fontSize: '22px', margin: '0 0 16px', fontWeight: 700 }}>You're Invited to Bacway</h1>
        <p style={{ lineHeight: 1.55, fontSize: '15px', margin: '0 0 16px' }}>
          Someone thinks you have valuable resources to share with students preparing for the BAC. Bacway is a collaborative hub where top students and teachers contribute notes, past papers, explanations, and structured study material.
        </p>
        <p style={{ lineHeight: 1.55, fontSize: '15px', margin: '0 0 16px' }}>
          This invitation was sent to <strong>{inviteeEmail}</strong>.
        </p>
        <p style={{ lineHeight: 1.55, fontSize: '15px', margin: '0 0 24px' }}>
          Click the button below to create your account and start contributing:
        </p>
        <p style={{ textAlign: 'center', margin: '0 0 32px' }}>
          <a
            href={inviteLink}
            style={{
              background: 'linear-gradient(90deg,#2563eb,#7c3aed)',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '14px 28px',
              borderRadius: '8px',
              fontWeight: 600,
              display: 'inline-block',
              fontSize: '15px'
            }}
          >
            Accept Invitation
          </a>
        </p>
        <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.5 }}>
          If the button doesn't work, copy and paste this link in your browser:<br />
          <span style={{ wordBreak: 'break-all', color: '#2563eb' }}>{inviteLink}</span>
        </p>
        <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
        <p style={{ fontSize: '12px', color: '#666' }}>
          You received this because someone submitted your email to invite you to Bacway. If you believe this was a mistake, you can ignore it.
        </p>
        <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>© {new Date().getFullYear()} Bacway. All rights reserved.</p>
      </div>
    </div>
  )
}

export default InviteEmailTemplate
