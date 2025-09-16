'use client';

import React from 'react'
import { useTranslation } from '@/i18n/TranslationProvider'


interface SendInviteButtonProps {
  loading: boolean
  disabled?: boolean
  onClick: () => void
}

const SendInviteButton: React.FC<SendInviteButtonProps> = ({ loading, disabled, onClick }) => {

  const { t } = useTranslation()

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`text-sm px-6 rounded-md transition-all duration-200 ${
        loading
          ? 'bg-blue-400 cursor-wait'
          : disabled
          ? 'bg-blue-300 cursor-not-allowed'
          : 'hover:bg-blue-500 bg-blue-600'
      } text-white`}
    >
      {loading ? t('invite.sending') : t('invite.sendButton')}
    </button>
  )
}

export default SendInviteButton
