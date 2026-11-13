import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SolvedByDifficultyChart } from '@/components/charts/SolvedByDifficultyChart'
import { DifficultyBadge } from '@/components/problems/DifficultyBadge'
import { StatusBadge } from '@/components/problems/StatusBadge'
import { 
  User, 
  Calendar, 
  Trophy, 
  Award, 
  CheckCircle2, 
  Code2, 
  Clock, 
  Flame,
  ArrowRight
} from 'lucide-react'
import { formatDate, getRatingColor, getRatingTitle } from '@/lib/utils'

interface PageProps {
  params: { username: string }
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `${params.username}'s Profile | DevArena`,
  }
}

export default async function UserProfilePage({ params }: PageProps) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      rating: true,
      role: true,
      createdAt: true,
      _count: {
        select: { submissions: true },
      },
      userAchievements: {
        include: { achievement: true },
        orderBy: { unlockedAt: 'desc' },
      },
      submissions: {
        take: 15,
        orderBy: { createdAt: 'desc' },
        include: {
          problem: {
            select: { title: true, slug: true, difficulty: true, points: true },
          },
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  // Calculate difficulty distribution
  const acceptedSubs = await prisma.submission.findMany({
    where: { userId: user.id, status: 'ACCEPTED' },
    select: {
      problemId: true,
      problem: { select: { difficulty: true } },
    },
  })

  const distinctProblemMap = new Map<string, string>()
  for (const sub of acceptedSubs) {
    distinctProblemMap.set(sub.problemId, sub.problem.difficulty)
  }

  let easyCount = 0
  let mediumCount = 0
  let hardCount = 0
  Array.from(distinctProblemMap.values()).forEach((diff) => {
    if (diff === 'EASY') easyCount++
    else if (diff === 'MEDIUM') mediumCount++
    else if (diff === 'HARD') hardCount++
  })

  const totalSolved = distinctProblemMap.size
  const totalSubmissions = user._count.submissions
  const acceptanceRate =
    totalSubmissions > 0
      ? Math.round((acceptedSubs.length / totalSubmissions) * 100)
      : 0

  const higherRankCount = await prisma.user.count({
    where: { rating: { gt: user.rating } },
  })
  const rank = higherRankCount + 1

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        {/* Profile Header */}
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-accent-600 to-blue-600 flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl shadow-lg">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                    {user.displayName || user.username}
                  </h1>
                  {user.role === 'ADMIN' && (
                    <Badge variant="purple">ADMIN</Badge>
                  )}
                </div>
                <p className="text-xs text-text-muted font-mono">@{user.username}</p>
                {user.bio && (
                  <p className="text-sm text-text-secondary max-w-xl pt-1 leading-relaxed">
                    {user.bio}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-text-muted font-mono pt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Rating pill */}
            <div className="bg-surface-2 p-4 rounded-xl border border-border text-center sm:text-right shrink-0">
              <p className="text-xs text-text-muted uppercase tracking-wider font-medium">Elo Rating</p>
              <p className={`text-2xl font-extrabold font-mono ${getRatingColor(user.rating)}`}>
                {user.rating}
              </p>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">
                {getRatingTitle(user.rating)} • Rank #{rank}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Solved by difficulty */}
          <Card className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">
              Problems Solved
            </h3>
            <SolvedByDifficultyChart easy={easyCount} medium={mediumCount} hard={hardCount} />
          </Card>

          {/* Key metrics */}
          <Card className="p-6 flex flex-col justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">
              Performance Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-surface-2 rounded-lg border border-border">
                <span className="text-xs text-text-secondary">Acceptance Rate</span>
                <span className="text-base font-bold text-green-400 font-mono">{acceptanceRate}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-2 rounded-lg border border-border">
                <span className="text-xs text-text-secondary">Total Submissions</span>
                <span className="text-base font-bold text-text-primary font-mono">{totalSubmissions}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-2 rounded-lg border border-border">
                <span className="text-xs text-text-secondary">Total Solved</span>
                <span className="text-base font-bold text-accent-400 font-mono">{totalSolved}</span>
              </div>
            </div>
          </Card>

          {/* Achievements preview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">
                Achievements ({user.userAchievements.length})
              </h3>
              <Link href="/achievements" className="text-xs text-accent-400 hover:underline">
                View all
              </Link>
            </div>

            {user.userAchievements.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-8">No achievements unlocked yet</p>
            ) : (
              <div className="space-y-2.5">
                {user.userAchievements.slice(0, 4).map((ua) => (
                  <div key={ua.achievement.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-2 border border-border">
                    <span className="text-xl">{ua.achievement.icon}</span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-text-primary truncate">{ua.achievement.title}</p>
                      <p className="text-[10px] text-text-muted truncate">{ua.achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Recent Submissions */}
        <div className="border border-border rounded-xl bg-surface overflow-hidden">
          <div className="p-4 border-b border-border bg-surface-2/40">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">
              Recent Submissions
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2/60 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  <th className="py-3 px-4">Problem</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Runtime</th>
                  <th className="py-3 px-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {user.submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-3 px-4">
                      <Link href={`/problems/${sub.problem.slug}`} className="font-semibold text-text-primary hover:text-accent-400 transition-colors">
                        {sub.problem.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-text-secondary">
                      {sub.language}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-text-muted">
                      {sub.runtime !== null ? `${sub.runtime}ms` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-text-muted font-mono">
                      {formatDate(sub.createdAt)}
                    </td>
                  </tr>
                ))}
                {user.submissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-text-muted">
                      No public submissions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
