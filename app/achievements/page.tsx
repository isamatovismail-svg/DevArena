'use client'

import React, { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/Spinner'
import { Award, Lock, CheckCircle2, Sparkles } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface AchievementItem {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  points: number
  isUnlocked: boolean
  unlockedAt: string | null
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementItem[]>([])
  const [loading, setLoading] = useState(true)
  const [unlockedCount, setUnlockedCount] = useState(0)

  useEffect(() => {
    async function loadAchievements() {
      try {
        setLoading(true)
        const res = await fetch('/api/achievements')
        const data = await res.json()
        if (res.ok) {
          setAchievements(data.achievements || [])
          setUnlockedCount(data.unlockedCount || 0)
        }
      } catch (err) {
        console.error('Failed to load achievements:', err)
      } finally {
        setLoading(false)
      }
    }
    loadAchievements()
  }, [])

  const totalPoints = achievements
    .filter((a) => a.isUnlocked)
    .reduce((sum, a) => sum + a.points, 0)

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-accent-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Award className="h-4 w-4" />
            <span>Badges & Honors</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Developer Achievements
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Unlock achievements through consistent problem solving, contest victories, and hard-tier completions.
          </p>
        </div>

        {/* Progress Summary Card */}
        <div className="bg-surface border border-border rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Unlocked Badges</span>
            <p className="text-2xl font-extrabold text-accent-400 font-mono">
              {unlockedCount} / {achievements.length}
            </p>
            <p className="text-xs text-text-secondary">
              {achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0}% completed
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Achievement Score</span>
            <p className="text-2xl font-extrabold text-yellow-400 font-mono">
              {totalPoints} pts
            </p>
            <p className="text-xs text-text-secondary">Earned from honors</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Next Tier</span>
            <p className="text-2xl font-extrabold text-text-primary">
              {unlockedCount < 5 ? 'Novice Warrior' : unlockedCount < 10 ? 'Arena Veteran' : 'Grand Champion'}
            </p>
            <p className="text-xs text-text-secondary">Continue solving to advance</p>
          </div>
        </div>

        {/* Achievements Grid */}
        {loading ? (
          <PageLoader text="Loading your honors..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {achievements.map((ach) => (
              <Card
                key={ach.id}
                className={`p-5 transition-all duration-200 ${
                  ach.isUnlocked
                    ? 'border-accent-500/30 bg-surface/90 shadow-md shadow-accent-500/5'
                    : 'border-border/60 bg-surface/40 opacity-70'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border ${
                      ach.isUnlocked
                        ? 'bg-accent-600/15 border-accent-500/30 shadow-inner'
                        : 'bg-surface-2 border-border grayscale'
                    }`}
                  >
                    {ach.isUnlocked ? ach.icon : <Lock className="h-5 w-5 text-text-muted" />}
                  </div>

                  <div className="space-y-1 flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-sm font-bold text-text-primary truncate">{ach.title}</h3>
                      <span className="text-[11px] font-mono font-semibold text-accent-400 shrink-0">
                        +{ach.points}
                      </span>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                      {ach.description}
                    </p>

                    <div className="pt-2 flex items-center gap-1.5 text-[11px]">
                      {ach.isUnlocked ? (
                        <span className="text-green-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Unlocked {ach.unlockedAt ? formatDate(ach.unlockedAt) : ''}
                        </span>
                      ) : (
                        <span className="text-text-muted flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Locked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
