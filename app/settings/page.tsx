'use client'

import React, { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { PageLoader } from '@/components/ui/Spinner'
import { Settings, User, Lock, Save, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; username: string; email: string; displayName: string | null; bio: string | null } | null>(null)

  // Profile Form
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true)
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
          setDisplayName(data.user.displayName || '')
          setBio(data.user.bio || '')
        }
      } catch (err) {
        console.error('Failed to load user settings:', err)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSavingProfile(true)
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'profile',
          displayName,
          bio,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success('Profile updated successfully!')
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch {
      toast.error('Network error updating profile')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    try {
      setIsUpdatingPassword(true)
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'password',
          currentPassword,
          newPassword,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success('Password updated successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(data.error || 'Failed to update password')
      }
    } catch {
      toast.error('Network error updating password')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <PageLoader text="Loading your settings..." />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        <div>
          <div className="flex items-center gap-2 text-accent-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Settings className="h-4 w-4" />
            <span>Preferences</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage your personal profile, credentials, and competitive arena appearance.
          </p>
        </div>

        {/* Profile Card */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-9 h-9 rounded-xl bg-accent-600/20 text-accent-400 flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">Public Profile Information</h2>
              <p className="text-xs text-text-secondary">Visible on your public profile and global rankings</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Username"
                value={user?.username || ''}
                disabled
                helperText="Username cannot be modified after registration"
              />

              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
                helperText="Primary email tied to this account"
              />
            </div>

            <Input
              label="Display Name"
              placeholder="Your full name or competitive handle"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              helperText="Shown on leaderboards and contest standings"
            />

            <Textarea
              label="Bio"
              placeholder="Tell other competitors about your interests, preferred algorithms, or background..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              helperText="Maximum 500 characters"
            />

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSavingProfile}
                leftIcon={<Save className="h-4 w-4" />}
              >
                Save Profile
              </Button>
            </div>
          </form>
        </Card>

        {/* Password Card */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">Change Password</h2>
              <p className="text-xs text-text-secondary">Ensure your account uses a strong, unique passphrase</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
            <Input
              type="password"
              label="Current Password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <Input
              type="password"
              label="New Password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              helperText="Minimum 8 characters"
            />

            <Input
              type="password"
              label="Confirm New Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="pt-2 flex justify-start">
              <Button
                type="submit"
                variant="secondary"
                size="md"
                isLoading={isUpdatingPassword}
                leftIcon={<Shield className="h-4 w-4" />}
              >
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </MainLayout>
  )
}
