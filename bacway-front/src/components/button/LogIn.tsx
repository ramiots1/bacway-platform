import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/i18n/TranslationProvider'

const LogIn = () => {
  const [email, setEmail] = useState('')
  const router = useRouter()
  const { t, locale } = useTranslation()

  const handleLogin = () => {
    if (email.trim()) {
      // Navigate to login page with email as query parameter
      router.push(`/login?email=${encodeURIComponent(email)}`)
    }
  }

  const handleCreateAccount = () => {
    // Navigate to signup page
    router.push('/signup')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="flex md:flex-row flex-col items-center gap-3">
      {/* Email Input with Login Button Inside */}
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('auth.emailPlaceholder') || 'Enter your email...'}
          className={`w-80 h-10  rounded-xl border border-white bg-white/40 backdrop-blur-sm text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${locale === 'ar' ? 'text-right pl-34 pr-4' : 'text-left pl-4 pr-20'}`}
        />
        <button
          onClick={handleLogin}
          disabled={!email.trim()}
          className={`absolute top-1/2 transform -translate-y-1/2 ${locale === 'ar' ? 'right-47 md:right-47' : 'right-2'} px-4 bg-blue-600 text-white text-sm font-medium rounded-lg h-7 hover:bg-blue-300 disabled:bg-blue-700 transition-colors duration-200`}
        >
          {t('auth.login') || 'Log In'}
        </button>
      </div>

      {/* Create Account Button */}
      <button
        onClick={handleCreateAccount}
        className="px-6 w-80 md:w-45 h-10 border-2 border-white text-white font-medium rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-200 whitespace-nowrap"
      >
        {t('auth.createAccount') || 'Create Account'}
      </button>
    </div>
  )
}

export default LogIn