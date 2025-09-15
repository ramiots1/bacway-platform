import React from 'react'

interface SendInviteButtonProps {
  loading: boolean
  disabled?: boolean
  onClick: () => void
  children?: React.ReactNode
}

const SendInviteButton: React.FC<SendInviteButtonProps> = ({ loading, disabled, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="h-12 px-6 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
          <span>Sending...</span>
        </span>
      ) : (
        children || 'Send Invite'
      )}
    </button>
  )
}

export default SendInviteButton
