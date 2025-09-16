import React, { useState } from 'react'
import { useTranslation } from '@/i18n/TranslationProvider'
import SendInviteButton from '@/components/button/SendInviteButton'

const EmailTemplate = (inviteLink: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Bacway 🚀</title>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@100;200;300;400;500;600;700;800;900&family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Outfit', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
            line-height: 1.6;
            color: #ffffff;
            background: #0C1114;
            padding: 20px 0;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #111418;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            animation: slideIn 0.8s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .header {
            background: #0C1114;
            padding: 38px 30px 34px 30px;
            text-align: center;
            position: relative;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .logo {
            font-size: 30px;
            font-weight: 700;
            letter-spacing: 0.5px;
            color: #ffffff;
            margin-bottom: 6px;
            position: relative;
            z-index: 2;
            text-shadow: 0 2px 8px rgba(0,0,0,0.6);
        }
        
        .header-subtitle {
            color: rgba(255, 255, 255, 0.7);
            font-size: 16px;
            font-weight: 500;
            position: relative;
            z-index: 2;
        }
        
        .main-content {
            padding: 40px;
            background: #111418;
        }
        
        .greeting {
            font-size: 28px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 25px;
            line-height: 1.3;
            animation: fadeInUp 0.8s ease-out 0.2s both;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .invite-text {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 20px;
            line-height: 1.7;
            animation: fadeInUp 0.8s ease-out 0.4s both;
        }
        
        .highlight {
            color: #3b82f6;
            font-weight: 600;
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
        }
        
        .stats-section {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
            border: 1px solid rgba(59, 130, 246, 0.2);
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            animation: fadeInUp 0.8s ease-out 0.6s both;
        }
        
        .stats-title {
            text-align: center;
            color: #3b82f6;
            font-weight: 600;
            margin-bottom: 15px;
            font-size: 16px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            margin-top: 10px;
        }
        
        .stat-item {
            text-align: center;
            animation: bounceIn 0.8s ease-out;
        }
        
        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: scale(0.3);
            }
            50% {
                transform: scale(1.05);
            }
            70% {
                transform: scale(0.9);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        .stat-number {
            font-size: 24px;
            font-weight: 700;
            color: #3b82f6;
            display: block;
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
        }
        
        .stat-label {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .cta-section {
            text-align: center;
            margin: 40px 0;
            animation: fadeInUp 0.8s ease-out 0.8s both;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease;
            border: 1px solid rgba(59, 130, 246, 0.5);
            position: relative;
            overflow: hidden;
        }
        
        .cta-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
        }
        
        .cta-button:hover::before {
            left: 100%;
        }
        
        .features {
            margin: 35px 0;
            animation: fadeInUp 0.8s ease-out 1s both;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding: 12px 0;
            transition: transform 0.2s ease;
        }
        
        .feature-item:hover {
            transform: translateX(5px);
        }
        
        .feature-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .feature-text {
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
            font-weight: 500;
        }
        
        .footer {
            background: #0C1114;
            padding: 30px 40px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
        }
        
        .footer-text {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
            margin-bottom: 15px;
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            margin: 25px 0;
        }
        
        .pulse {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            }
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 0 10px;
                border-radius: 12px;
            }
            
            .main-content {
                padding: 25px;
            }
            
            .header {
                padding: 25px 20px;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .greeting {
                font-size: 24px;
            }
            
            .cta-button {
                padding: 14px 30px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">Bacway</div>
            <div class="header-subtitle">Collaborative BAC Knowledge Hub</div>
        </div>
        
        <!-- Main Content -->
        <div class="main-content">
            <h1 class="greeting">Your Experience Can Help Thousands 🎓</h1>
            
            <p class="invite-text">
                Hello there!
            </p>
            
            <p class="invite-text">
                Someone believes you have valuable knowledge to share, and we couldn't agree more. You've been invited to join <span class="highlight">Bacway</span> — where contributors help build the richest, most organized bank of real BAC resources for Algerian students.
            </p>
            
            <div class="stats-section">
                    <div class="stats-title">Bacway Impact So Far</div>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-number">10+</span>
                            <span class="stat-label">Contributors</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">10+</span>
                            <span class="stat-label">Drives Shared</span>
                        </div>
                    </div>
            </div>
            
            <p class="invite-text">
                As a contributor, you help transform scattered materials into structured, actionable learning. Contributors share:
            </p>
            
            <div class="features">
                <div class="feature-item">
                    <div class="feature-icon">📚</div>
                    <div class="feature-text">Authentic exam papers and solutions from real BAC sessions</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">✍️</div>
                    <div class="feature-text">Comprehensive study notes and summaries</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🎯</div>
                    <div class="feature-text">Strategic tips and methodologies for exam success</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🤝</div>
                    <div class="feature-text">A supportive community of ambitious learners</div>
                </div>
            </div>
            
            <div class="divider"></div>
            
            <p class="invite-text">
                Every drive, note, and solved paper you share can directly impact a student's confidence and results. Together we reduce gatekeeping and make quality preparation accessible.
            </p>
            
            <div class="cta-section">
                <a href="https://bacway.com/signup?ref=invite" class="cta-button pulse">
                    🌟 Start Contributing Today
                </a>
                <p style="margin-top: 15px; font-size: 14px; color: rgba(255, 255, 255, 0.6);">
                    Join in less than 2 minutes • No credit card required
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                <strong>Ready to make an impact?</strong><br>
                Join thousands of students who are already building Algeria's educational future, one resource at a time.
            </p>
            
            <div class="divider"></div>
            
            <p style="font-size: 12px; color: rgba(255, 255, 255, 0.5); line-height: 1.6;">
                This invitation was sent because someone believes in your potential to contribute meaningful educational resources. If you weren't expecting this invitation, you can safely ignore this email.
            </p>
            
            <div class="social-links" style="margin-top:22px;">
                <a href="https://instagram.com/bacway.app" style="display:inline-block; text-decoration:none; color:#fff; font-size:14px; background:#3b82f6; padding:10px 20px; border-radius:32px; font-weight:600; letter-spacing:0.5px; box-shadow:0 4px 14px rgba(59,130,246,0.4);">📸 Follow us on Instagram</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: rgba(255, 255, 255, 0.4);">
                © 2024 Bacway • Building the future of collaborative learning in Algeria
            </p>
        </div>
    </div>
</body>
</html>
`;

const InviteContributors: React.FC = () => {
  const { t, locale } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value)

  const handleSend = async () => {
    if (!validateEmail(email)) {
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          {
            to: email,
            subject: "You're invited to contribute to Bacway!",
            html: EmailTemplate('https://bacway.com'),
          }
        )
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to send invitation')

      setEmail('');
      
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="w-full py-5 flex flex-col justify-center items-center mb-20 text-center ">
      <div className="max-w-6xl mx-4 px-4">
        <div className="space-y-10 flex flex-col">
          {/* Heading & Intro */}
          <div className="flex flex-col justify-center items-center text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white ">
              {t('invite.title')}
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base max-w-2xl">
              <br />
              {t('invite.introLine1')}
              <br />
              {t('invite.introLine2')}
            </p>
          </div>

          {/* Email Form */}
          <div className="max-w-sm md:max-w-lg mx-auto text-center relative">
              <div className="flex h-12  bg-white/10 border border-white focus:border-blue-500 rounded-xl py-2 px-2 text-white transition-colors duration-200 " dir ={locale === 'ar' ? 'rtl' : 'ltr'}>
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('invite.emailPlaceholder') || 'Enter email address...'}
                    className="w-full px-2 h-full focus:outline-none bg-transparent text-white font-medium"
                  />
                </div>
                  <SendInviteButton
                  loading={loading}
                  disabled={!email}
                  onClick={handleSend}
                  />
                
              </div>

              <p className="mt-4 text-xs text-blue-200/60">
                {t('invite.emailNote')}
              </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InviteContributors
