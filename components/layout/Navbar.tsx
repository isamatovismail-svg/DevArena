'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Code2, 
  Trophy, 
  BarChart2, 
  BookOpen, 
  User, 
  LogOut, 
  Settings, 
  Shield, 
  Menu, 
  X, 
  Zap, 
  History,
  Award,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface NavUser {
  id: string
  username: string
  role: string
}

interface NavbarProps {
  user?: NavUser | null
}

const navLinks = [
  { href: '/problems', label: 'Problems', icon: BookOpen },
  { href: '/contests', label: 'Contests', icon: Trophy },
  { href: '/leaderboard', label: 'Leaderboard', icon: BarChart2 },
]

export function Navbar({ user: initialUser }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<NavUser | null>(initialUser ?? null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  React.useEffect(() => {
    if (initialUser !== undefined) {
      setCurrentUser(initialUser)
      return
    }

    let isMounted = true
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.user) {
          setCurrentUser({
            id: data.user.id,
            username: data.user.username,
            role: data.user.role,
          })
        }
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [initialUser, pathname])

  const user = currentUser

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.ok) {
        toast.success('Signed out successfully')
        router.push('/')
        router.refresh()
      }
    } catch {
      toast.error('Failed to sign out')
    } finally {
      setIsLoggingOut(false)
      setUserMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-accent-600 to-blue-600 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200">
                <Zap className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-text-primary">
                Dev<span className="text-accent-400">Arena</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || pathname?.startsWith(`${href}/`)
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-surface-2 text-text-primary font-semibold shadow-sm'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-2/60'
                    )}
                  >
                    <Icon className="h-4 w-4 opacity-75" />
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right Action buttons / User Menu */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-surface-2 border border-transparent hover:border-border transition-all"
                  aria-expanded={userMenuOpen}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-600 to-accent-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-sm font-semibold text-text-primary leading-tight">
                      {user.username}
                    </span>
                    <span className="text-[10px] text-accent-400 uppercase tracking-wider font-mono">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-text-muted hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-2xl py-1.5 z-50 animate-in">
                      <div className="px-3.5 py-2 border-b border-border mb-1 sm:hidden">
                        <p className="text-xs font-semibold text-text-primary">{user.username}</p>
                        <p className="text-[10px] text-accent-400 font-mono">{user.role}</p>
                      </div>

                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 text-accent-400" />
                        Dashboard
                      </Link>

                      <Link
                        href={`/u/${user.username}`}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <BookOpen className="h-4 w-4 text-blue-400" />
                        Public Profile
                      </Link>

                      <Link
                        href="/submissions"
                        className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <History className="h-4 w-4 text-green-400" />
                        My Submissions
                      </Link>

                      <Link
                        href="/achievements"
                        className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Award className="h-4 w-4 text-yellow-400" />
                        Achievements
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 text-text-muted" />
                        Settings
                      </Link>

                      {user.role === 'ADMIN' && (
                        <>
                          <div className="border-t border-border my-1" />
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-accent-400 font-medium hover:bg-surface-2 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Shield className="h-4 w-4" />
                            Admin Console
                          </Link>
                        </>
                      )}

                      <div className="border-t border-border my-1" />
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-400 hover:bg-red-500/10 w-full text-left transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2.5">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" variant="primary">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in space-y-3">
            <nav className="flex flex-col space-y-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname?.startsWith(href)
                      ? 'bg-surface-2 text-text-primary font-semibold'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>

            {!user && (
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
