'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { DifficultyBadge } from '@/components/problems/DifficultyBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  BarChart2, 
  BookOpen,
  Medal,
  AlertCircle
} from 'lucide-react'
import { formatDateTime, getRatingColor, getRatingTitle } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ContestDetail {
  id: string
  slug: string
  title: string
  description: string
  startTime: string
  endTime: string
  status: 'ACTIVE' | 'UPCOMING' | 'PAST'
  isRegistered: boolean
  userScore: number
  userRank: number | null
  problems: Array<{
    id: string
    slug: string
    title: string
    difficulty: string
    points: number
    orderIndex: number
    tags: string[]
  }>
  leaderboard: Array<{
    id: string
    score: number
    rank: number
    registeredAt: string
    user: {
      id: string
      username: string
      displayName: string | null
      avatarUrl: string | null
      rating: number
    }
  }>
}

export default function ContestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [contest, setContest] = useState<ContestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRegistering, setIsRegistering] = useState(false)
  const [activeTab, setActiveTab] = useState<'problems' | 'leaderboard'>('problems')

  const fetchContest = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/contests/${slug}`)
      const data = await res.json()
      if (res.ok) {
        setContest(data.contest)
      } else {
        toast.error(data.error || 'Contest not found')
      }
    } catch (err) {
      console.error('Error loading contest:', err)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    fetchContest()
  }, [fetchContest])

  const handleRegister = async () => {
    try {
      setIsRegistering(true)
      const res = await fetch(`/api/contests/${slug}/register`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        toast.success('Successfully registered for this contest!')
        fetchContest()
      } else {
        if (res.status === 401) {
          toast.error('Please sign in to register')
          router.push('/login')
          return
        }
        toast.error(data.error || 'Failed to register')
      }
    } catch {
      toast.error('Registration failed')
    } finally {
      setIsRegistering(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <PageLoader text="Loading contest arena..." />
      </MainLayout>
    )
  }

  if (!contest) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-text-primary">Contest Not Found</h1>
          <p className="text-sm text-text-secondary mt-1 mb-6">The requested contest could not be found or has not been published.</p>
          <Link href="/contests">
            <Button size="sm" variant="secondary">Back to Contests</Button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  const durationHours = Math.round(
    (new Date(contest.endTime).getTime() - new Date(contest.startTime).getTime()) / (1000 * 60 * 60)
  )

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        {/* Contest Hero Banner */}
        <div className="bg-gradient-to-br from-surface to-surface-2 border border-border rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                {contest.status === 'ACTIVE' ? (
                  <Badge variant="success" className="animate-pulse">Live Now</Badge>
                ) : contest.status === 'UPCOMING' ? (
                  <Badge variant="info">Upcoming</Badge>
                ) : (
                  <Badge variant="default">Completed</Badge>
                )}
                <span className="text-xs text-text-muted font-mono">{durationHours} Hours Duration</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                {contest.title}
              </h1>

              <p className="text-sm text-text-secondary leading-relaxed">
                {contest.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-muted pt-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDateTime(contest.startTime)} — {formatDateTime(contest.endTime)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {contest.leaderboard.length} Participants
                </span>
              </div>
            </div>

            {/* Registration status / Action */}
            <div className="flex flex-col items-start md:items-end justify-center gap-3 shrink-0">
              {contest.isRegistered ? (
                <div className="flex flex-col items-start md:items-end gap-1">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Registered Competitor</span>
                  </div>
                  {contest.userScore > 0 && (
                    <span className="text-xs font-mono text-text-secondary">
                      Score: <strong className="text-accent-400">{contest.userScore} pts</strong>
                      {contest.userRank && ` • Rank #${contest.userRank}`}
                    </span>
                  )}
                </div>
              ) : contest.status !== 'PAST' ? (
                <Button
                  size="lg"
                  variant="primary"
                  onClick={handleRegister}
                  isLoading={isRegistering}
                  leftIcon={<Trophy className="h-4 w-4" />}
                >
                  Register for Contest
                </Button>
              ) : (
                <Badge variant="default">Registration Closed</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Tab Switcher: Problems vs Leaderboard */}
        <div className="flex gap-2 border-b border-border pb-2">
          <button
            onClick={() => setActiveTab('problems')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'problems'
                ? 'bg-accent-600 text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Contest Problems ({contest.problems.length})
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'leaderboard'
                ? 'bg-accent-600 text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
            }`}
          >
            <BarChart2 className="h-4 w-4" />
            Contest Leaderboard
          </button>
        </div>

        {/* Content Panel */}
        {activeTab === 'problems' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contest.problems.map((prob, idx) => (
                <Link
                  key={prob.id}
                  href={`/problems/${prob.slug}?contestId=${contest.id}`}
                >
                  <Card hover className="p-5 flex items-center justify-between group">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-accent-600/20 text-accent-400 font-mono font-bold text-xs flex items-center justify-center">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <DifficultyBadge difficulty={prob.difficulty} />
                      </div>
                      <h3 className="text-base font-semibold text-text-primary group-hover:text-accent-400 transition-colors">
                        {prob.title}
                      </h3>
                      <div className="flex gap-1">
                        {prob.tags.map((t) => (
                          <span key={t} className="text-[10px] text-text-muted bg-surface-2 px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-semibold text-accent-400">{prob.points} pts</span>
                      <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* Contest Leaderboard */
          <div className="border border-border rounded-xl bg-surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2/60 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <th className="py-3 px-4 w-16 text-center">Rank</th>
                    <th className="py-3 px-4">Competitor</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {contest.leaderboard.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-2/40 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-xs">
                        {item.rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400">🥇</span>
                        ) : item.rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-400/20 text-slate-300">🥈</span>
                        ) : item.rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-500">🥉</span>
                        ) : (
                          <span className="text-text-muted font-mono">#{item.rank}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <Link href={`/u/${item.user.username}`} className="font-semibold text-text-primary hover:text-accent-400 transition-colors">
                          {item.user.displayName || item.user.username}
                        </Link>
                        <span className="text-xs text-text-muted font-mono block">@{item.user.username}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-xs font-semibold ${getRatingColor(item.user.rating)}`}>
                          {item.user.rating} ({getRatingTitle(item.user.rating)})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-accent-400">
                        {item.score} pts
                      </td>
                    </tr>
                  ))}
                  {contest.leaderboard.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xs text-text-muted">
                        No submissions recorded for this contest yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
