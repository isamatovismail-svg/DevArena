'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      toast.success(`Welcome back, ${data.user.username}!`)
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
      toast.error(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoFill = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword(demoEmail.includes('admin') ? 'admin123' : 'demo123')
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(124,58,237,0.15),transparent)]" />
      
      <div className="w-full max-w-md z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-accent-600 rounded-xl group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="font-extrabold text-2xl text-text-primary tracking-tight">
              Dev<span className="text-accent-400">Arena</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Sign in to your account</h1>
          <p className="text-sm text-text-secondary mt-1">Enter your credentials to access the arena</p>
        </div>

        <Card className="p-6 sm:p-8 backdrop-blur-md bg-surface/90">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-lg text-xs text-red-400 font-medium">
                {error}
              </div>
            )}

            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="developer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftIcon={<Lock className="h-4 w-4" />}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              variant="primary"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Demo account quick login helper (development/demo mode only) */}
          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-6 pt-5 border-t border-border">
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider text-center mb-2.5">
                Quick Fill Demo Accounts (Dev Mode)
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleDemoFill('admin@devarena.dev')}
                  className="p-2 rounded-lg bg-surface-2 hover:bg-surface-3 border border-border text-text-secondary hover:text-text-primary transition-colors text-left"
                >
                  <div className="font-semibold text-accent-400">Admin</div>
                  <div className="text-[10px] text-text-muted font-mono truncate">admin@devarena.dev</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('alice@example.com')}
                  className="p-2 rounded-lg bg-surface-2 hover:bg-surface-3 border border-border text-text-secondary hover:text-text-primary transition-colors text-left"
                >
                  <div className="font-semibold text-green-400">Alice (User)</div>
                  <div className="text-[10px] text-text-muted font-mono truncate">alice@example.com</div>
                </button>
              </div>
            </div>
          )}
        </Card>

        <p className="text-center text-xs text-text-secondary mt-6">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="text-accent-400 hover:text-accent-300 font-semibold underline underline-offset-4">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  )
}
