import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/problems/StatusBadge'
import { 
  Shield, 
  BookOpen, 
  Trophy, 
  Users, 
  Code2, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Plus
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    redirect('/')
  }

  const [userCount, problemCount, submissionCount, contestCount, recentSubmissions, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.problem.count(),
      prisma.submission.count(),
      prisma.contest.count(),
      prisma.submission.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { username: true } },
          problem: { select: { title: true, slug: true } },
        },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, username: true, email: true, role: true, rating: true, createdAt: true },
      }),
    ])

  const acceptedCount = await prisma.submission.count({ where: { status: 'ACCEPTED' } })
  const acceptanceRate = submissionCount > 0 ? Math.round((acceptedCount / submissionCount) * 100) : 0

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar user={user} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-accent-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Shield className="h-4 w-4" />
              <span>Admin Console</span>
            </div>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
              DevArena Administration
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Manage platform challenges, tournament schedules, submissions audit, and user accounts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin/problems">
              <Button size="sm" variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                Manage Problems
              </Button>
            </Link>
            <Link href="/admin/contests">
              <Button size="sm" variant="secondary" leftIcon={<Trophy className="h-4 w-4" />}>
                Manage Contests
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Total Users</span>
              <Users className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-2xl font-extrabold font-mono text-text-primary">{userCount}</p>
            <Link href="/admin/users" className="text-xs text-accent-400 hover:underline mt-1 inline-block">
              Manage users →
            </Link>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Problems</span>
              <BookOpen className="h-4 w-4 text-accent-400" />
            </div>
            <p className="text-2xl font-extrabold font-mono text-text-primary">{problemCount}</p>
            <Link href="/admin/problems" className="text-xs text-accent-400 hover:underline mt-1 inline-block">
              Manage catalog →
            </Link>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Contests</span>
              <Trophy className="h-4 w-4 text-yellow-400" />
            </div>
            <p className="text-2xl font-extrabold font-mono text-text-primary">{contestCount}</p>
            <Link href="/admin/contests" className="text-xs text-accent-400 hover:underline mt-1 inline-block">
              Manage rounds →
            </Link>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Submissions</span>
              <Code2 className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-2xl font-extrabold font-mono text-green-400">{submissionCount}</p>
            <p className="text-xs text-text-secondary mt-1">{acceptanceRate}% acceptance rate</p>
          </Card>
        </div>

        {/* Administration Navigation Quicklinks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/problems">
            <Card hover className="p-6 space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-accent-600/20 text-accent-400 flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-400 transition-colors">
                Problem Management
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Create new algorithmic problems, edit test cases and examples, modify time/memory limits, or toggle publication status.
              </p>
              <span className="text-xs text-accent-400 font-semibold inline-flex items-center gap-1">
                Open Problem Manager <ArrowRight className="h-3 w-3" />
              </span>
            </Card>
          </Link>

          <Link href="/admin/contests">
            <Card hover className="p-6 space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
                <Trophy className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-400 transition-colors">
                Contest Operations
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Schedule new competitive rounds, assign problem sets with customized point tiers, and monitor live leaderboards.
              </p>
              <span className="text-xs text-yellow-400 font-semibold inline-flex items-center gap-1">
                Open Contest Manager <ArrowRight className="h-3 w-3" />
              </span>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card hover className="p-6 space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-400 transition-colors">
                User Management
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                View registered users, inspect submission statistics, assign administrator privileges, and audit account ratings.
              </p>
              <span className="text-xs text-blue-400 font-semibold inline-flex items-center gap-1">
                Open User Manager <ArrowRight className="h-3 w-3" />
              </span>
            </Card>
          </Link>
        </div>

        {/* Live Submissions Audit Table */}
        <div className="border border-border rounded-xl bg-surface overflow-hidden">
          <div className="p-4 border-b border-border bg-surface-2/40 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">
              Live System Submissions Stream
            </h3>
            <span className="text-xs text-text-muted font-mono">Latest 8 entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-2/60 text-text-muted uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-4">User</th>
                  <th className="py-2.5 px-4">Problem</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Language</th>
                  <th className="py-2.5 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-surface-2/40">
                    <td className="py-2.5 px-4 font-semibold text-text-primary">
                      <Link href={`/u/${sub.user.username}`} className="hover:text-accent-400">
                        {sub.user.username}
                      </Link>
                    </td>
                    <td className="py-2.5 px-4 text-text-secondary">
                      <Link href={`/problems/${sub.problem.slug}`} className="hover:text-accent-400">
                        {sub.problem.title}
                      </Link>
                    </td>
                    <td className="py-2.5 px-4">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="py-2.5 px-4 font-mono text-text-muted">{sub.language}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-text-muted">
                      {formatDateTime(sub.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
