'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ActivityChart } from '@/components/charts/ActivityChart'
import { SolvedByDifficultyChart } from '@/components/charts/SolvedByDifficultyChart'
import { StatusBadge } from '@/components/problems/StatusBadge'
import { DifficultyBadge } from '@/components/problems/DifficultyBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { 
  Trophy, 
  CheckCircle2, 
  Code2, 
  TrendingUp, 
  Flame, 
  Award, 
  ArrowRight, 
  Calendar,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react'
import { formatDate, getRatingColor, getRatingTitle } from '@/lib/utils'

interface DashboardData {
  user: {
    id: string
    username: string
    displayName: string | null
    rating: number
    rank: number
  }
  stats: {
    totalSolved: number
    totalSubmissions: number
    acceptanceRate: number
    rating: number
    rank: number
    contestCount: number
    easyCount: number
    mediumCount: number
    hardCount: number
  }
  activityData: Array<{ date: string; submissions: number; accepted: number }>
  recentSubmissions: Array<{
    id: string
    status: string
    language: string
    runtime: number | null
    createdAt: string
    problem: { title: string; slug: string; difficulty: string }
  }>
  recentAchievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    unlockedAt: string
  }>
  upcomingContests: Array<{
    id: string
    slug: string
    title: string
    startTime: string
    participantsCount: number
  }>
  recommendedProblems: Array<{
    id: string
    slug: string
    title: string
    difficulty: string
    category: string
    points: number
    isSolved: boolean
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        const res = await fetch('/api/dashboard')
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <MainLayout>
        <PageLoader text="Loading your dashboard..." />
      </MainLayout>
    )
  }

  if (!data) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-xl font-bold text-text-primary">Please Sign In</h1>
          <p className="text-sm text-text-secondary mt-1 mb-6">You need to be logged in to view your personalized dashboard.</p>
          <Link href="/login">
            <Button size="sm" variant="primary">Go to Login</Button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  const { user, stats, activityData, recentSubmissions, recentAchievements, upcomingContests, recommendedProblems } = data

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-surface to-surface-2 border border-border rounded-2xl">
          <div>
            <div className="flex items-center gap-2 text-accent-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Competitor Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Welcome back, {user.displayName || user.username}!
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Ready to climb the ranks today? Here is an overview of your current trajectory.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/problems">
              <Button size="sm" variant="primary" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                Solve Problems
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Key Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Elo Rating</span>
              <Trophy className="h-4 w-4 text-accent-400" />
            </div>
            <p className={`text-2xl font-extrabold font-mono ${getRatingColor(stats.rating)}`}>
              {stats.rating}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              {getRatingTitle(stats.rating)} • Rank #{stats.rank}
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Problems Solved</span>
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-2xl font-extrabold font-mono text-green-400">
              {stats.totalSolved}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Distinct algorithmic challenges
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Acceptance</span>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-2xl font-extrabold font-mono text-blue-400">
              {stats.acceptanceRate}%
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Across {stats.totalSubmissions} submissions
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Contests</span>
              <Award className="h-4 w-4 text-yellow-400" />
            </div>
            <p className="text-2xl font-extrabold font-mono text-yellow-400">
              {stats.contestCount}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Official rounds joined
            </p>
          </Card>
        </div>

        {/* Charts & Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Over Time Area Chart */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">
                  Submission Activity
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">30-day timeline of code executions</p>
              </div>
            </div>
            <ActivityChart data={activityData} />
          </Card>

          {/* Solved by Difficulty Donut */}
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-1">
                Difficulty Breakdown
              </h3>
              <p className="text-xs text-text-secondary mb-4">Solved distribution by tier</p>
            </div>
            <SolvedByDifficultyChart easy={stats.easyCount} medium={stats.mediumCount} hard={stats.hardCount} />
          </Card>
        </div>

        {/* Content 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recommended Problems */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-text-primary tracking-tight">
                Recommended Challenges
              </h3>
              <Link href="/problems" className="text-xs text-accent-400 hover:underline">
                Browse catalog →
              </Link>
            </div>

            <div className="space-y-2.5">
              {recommendedProblems.map((prob) => (
                <Link key={prob.id} href={`/problems/${prob.slug}`}>
                  <Card hover className="p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <DifficultyBadge difficulty={prob.difficulty} />
                      <div>
                        <h4 className="text-sm font-semibold text-text-primary group-hover:text-accent-400 transition-colors">
                          {prob.title}
                        </h4>
                        <span className="text-xs text-text-muted">{prob.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {prob.isSolved && (
                        <span className="text-[11px] text-green-400 flex items-center gap-1 font-mono">
                          <CheckCircle2 className="h-3 w-3" /> Solved
                        </span>
                      )}
                      <span className="text-xs font-mono font-medium text-accent-400">{prob.points} pts</span>
                      <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-text-primary transition-colors" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Recent Submissions */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-text-primary tracking-tight">
                  Recent Submissions
                </h3>
                <Link href="/submissions" className="text-xs text-accent-400 hover:underline">
                  View full history →
                </Link>
              </div>

              <div className="border border-border rounded-xl bg-surface overflow-hidden">
                <table className="w-full text-left text-xs">
                  <tbody className="divide-y divide-border">
                    {recentSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-surface-2/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-text-primary">
                          <Link href={`/problems/${sub.problem.slug}`} className="hover:text-accent-400">
                            {sub.problem.title}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="py-3 px-4 font-mono text-text-muted">{sub.language}</td>
                        <td className="py-3 px-4 font-mono text-text-muted">{sub.runtime ? `${sub.runtime}ms` : '-'}</td>
                        <td className="py-3 px-4 text-right font-mono text-text-muted">{formatDate(sub.createdAt)}</td>
                      </tr>
                    ))}
                    {recentSubmissions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-text-muted">
                          No submissions recorded yet. Pick a problem to get started!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar: Upcoming Contests & Achievements */}
          <div className="space-y-6">
            {/* Upcoming Contests */}
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Upcoming Contests
                </h3>
                <Link href="/contests" className="text-[11px] text-accent-400 hover:underline">
                  All
                </Link>
              </div>

              {upcomingContests.length === 0 ? (
                <p className="text-xs text-text-muted">No scheduled contests right now.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingContests.map((c) => (
                    <Link key={c.id} href={`/contests/${c.slug}`}>
                      <div className="p-3 rounded-lg bg-surface-2 hover:bg-surface-3 border border-border transition-colors space-y-1 group">
                        <p className="text-xs font-semibold text-text-primary group-hover:text-accent-400 transition-colors">
                          {c.title}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-text-muted font-mono">
                          <span>{formatDate(c.startTime)}</span>
                          <span>{c.participantsCount} Joined</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Achievements */}
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Recent Achievements
                </h3>
                <Link href="/achievements" className="text-[11px] text-accent-400 hover:underline">
                  View all
                </Link>
              </div>

              {recentAchievements.length === 0 ? (
                <p className="text-xs text-text-muted">Solve problems to unlock your first badge!</p>
              ) : (
                <div className="space-y-2.5">
                  {recentAchievements.map((ach) => (
                    <div key={ach.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-2 border border-border">
                      <span className="text-2xl shrink-0">{ach.icon}</span>
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold text-text-primary truncate">{ach.title}</p>
                        <p className="text-[10px] text-text-muted truncate">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
