'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { AdminProvider, useAdmin } from '@/lib/store'

const NAV = [
  { label: 'Dashboard',      href: '/dashboard',                icon: '◈' },
  { label: 'Contributions',  href: '/dashboard/contributions',  icon: '📁' },
  { label: 'Letters',        href: '/dashboard/letters',        icon: '✉' },
  { label: 'Users',          href: '/dashboard/users',          icon: '◉' },
  { label: 'Library',        href: '/dashboard/library',        icon: '◧' },
  { label: 'Settings',       href: '/dashboard/settings',       icon: '◎' },
]

function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markAllRead } = useAdmin()
  const icons: Record<string, string> = { new_contribution: '📁', new_letter: '✉', system: '◈' }

  return (
    <div
      className="absolute right-0 top-12 w-80 rounded-2xl border z-50 overflow-hidden"
      style={{ background: '#111', borderColor: '#222', boxShadow: '0 20px 60px #000a' }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#1a1a1a' }}>
        <span className="text-sm font-semibold text-white">Notifications</span>
        <button onClick={markAllRead} className="text-xs" style={{ color: '#00c8ff' }}>Mark all read</button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.map(n => (
          <div key={n.id} className="flex items-start gap-3 px-4 py-3 border-b" style={{ borderColor: '#1a1a1a', background: n.read ? 'transparent' : '#00c8ff06' }}>
            <span className="text-base flex-shrink-0 mt-0.5">{icons[n.type]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white leading-relaxed">{n.message}</p>
              <p className="text-xs mt-1" style={{ color: '#444' }}>{n.time}</p>
            </div>
            {!n.read && <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: '#00c8ff' }} />}
          </div>
        ))}
      </div>
      <button onClick={onClose} className="w-full py-3 text-xs text-center" style={{ color: '#555' }}>Close</button>
    </div>
  )
}

function Inner({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { contributions, letters, unreadCount } = useAdmin()
  const [collapsed, setCollapsed] = useState(false)
  const [showNotif, setShowNotif] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('bw_admin_auth')) router.push('/login')
  }, [router])

  const logout = () => { localStorage.removeItem('bw_admin_auth'); router.push('/login') }

  const pendingContribs = contributions.filter(c => c.status === 'pending').length
  const pendingLetters  = letters.filter(l => l.status === 'pending').length
  const BADGES: Record<string, number> = {
    '/dashboard/contributions': pendingContribs,
    '/dashboard/letters': pendingLetters,
  }

  const pageTitle = NAV.find(n => n.href === pathname)?.label ?? 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col flex-shrink-0 transition-all duration-300 z-20"
        style={{ width: collapsed ? 56 : 220, background: '#0d0d0d', borderRight: '1px solid #181818' }}
      >
        <div className="flex items-center px-3.5 border-b" style={{ borderColor: '#181818', height: 56 }}>
          {collapsed
            ? <span className="text-lg font-black text-white mx-auto">B</span>
            : <span className="text-lg font-black tracking-tight text-white">
                BAC<span className="font-thin">WAY</span>{' '}
                <span style={{ color: '#00c8ff', fontWeight: 300, fontSize: '0.78rem', letterSpacing: '0.12em' }}>ADMIN</span>
              </span>
          }
        </div>

        <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-hidden">
          {NAV.map(item => {
            const active = pathname === item.href
            const badge  = BADGES[item.href]
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className="relative flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                style={{ background: active ? '#00c8ff12' : 'transparent', color: active ? '#00c8ff' : '#555' }}
              >
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ background: '#00c8ff' }} />}
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                {!collapsed && badge > 0 && (
                  <span className="text-xs rounded-full px-1.5 py-0.5 font-bold" style={{ background: '#f59e0b20', color: '#f59e0b' }}>{badge}</span>
                )}
                {collapsed && badge > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="px-2 pb-3 pt-3 space-y-0.5 border-t" style={{ borderColor: '#181818' }}>
          <button onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm w-full" style={{ color: '#333' }}>
            <span className="text-base flex-shrink-0">{collapsed ? '▶' : '◀'}</span>
            {!collapsed && <span>Collapse</span>}
          </button>
          <button onClick={logout} className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm w-full" style={{ color: '#ef4444' }}>
            <span className="text-base flex-shrink-0">↩</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 flex-shrink-0 border-b" style={{ height: 56, background: '#0a0a0a', borderColor: '#181818' }}>
          <h1 className="text-white font-semibold text-sm">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            {pendingContribs + pendingLetters > 0 && (
              <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
                {pendingContribs + pendingLetters} pending review
              </span>
            )}
            <div className="relative">
              <button
                onClick={() => setShowNotif(v => !v)}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors text-sm"
                style={{ background: showNotif ? '#00c8ff15' : '#161616', color: showNotif ? '#00c8ff' : '#666' }}
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ background: '#ef4444', color: '#fff', fontSize: 9 }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotif && <NotificationsPanel onClose={() => setShowNotif(false)} />}
            </div>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold" style={{ background: '#00c8ff18', color: '#00c8ff' }}>A</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {showNotif && <div className="fixed inset-0 z-10" onClick={() => setShowNotif(false)} />}
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminProvider><Inner>{children}</Inner></AdminProvider>
}
