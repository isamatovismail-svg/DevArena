import React from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { prisma } from '@/lib/prisma'
import { 
  Zap, 
  Code2, 
  Trophy, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Terminal, 
  ShieldCheck,
  Flame,
  Users
} from 'lucide-react'

export const revalidate = 60

export default async function HomePage() {
  const [problemCount, userCount, contestCount, featuredProblems] = await Promise.all([
    prisma.problem.count({ where: { isPublished: true } }),
    prisma.user.count(),
    prisma.contest.count({ where: { isPublished: true } }),
    prisma.problem.findMany({
      where: { isPublished: true },
      take: 4,
      orderBy: { points: 'asc' },
      select: { id: true, slug: true, title: true, difficulty: true, category: true, points: true },
    }),
  ])

  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 border-b border-border/80">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(124,58,237,0.22),rgba(255,255,255,0))]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
            {/* Announcement badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-600/15 border border-accent-500/30 text-accent-300 text-xs font-medium mb-6">
              <Sparkles className="h-3.5 w-3.5 text-accent-400" />
              <span>Next Generation Competitive Programming Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-primary max-w-4xl mx-auto leading-tight">
              Master Algorithms.{' '}
              <span className="bg-gradient-to-r from-accent-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
                Compete Globally.
              </span>{' '}
              Elevate Your Craft.
            </h1>

            <p className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              DevArena fuses high-intensity competitive rounds with curated algorithmic problem sets, Monaco-powered multi-language execution, and real-time Elo rating progression.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/problems">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Start Solving
                </Button>
              </Link>
              <Link href="/contests">
                <Button size="lg" variant="secondary" leftIcon={<Trophy className="h-4 w-4 text-accent-400" />}>
                  Browse Contests
                </Button>
              </Link>
            </div>

            {/* Metrics Ribbon */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-surface/80 border border-border p-5 rounded-2xl">
                <p className="text-3xl font-extrabold text-text-primary tracking-tight">{problemCount}+</p>
                <p className="text-xs text-text-secondary uppercase tracking-wider mt-1 font-medium">Curated Problems</p>
              </div>
              <div className="bg-surface/80 border border-border p-5 rounded-2xl">
                <p className="text-3xl font-extrabold text-accent-400 tracking-tight">{userCount}</p>
                <p className="text-xs text-text-secondary uppercase tracking-wider mt-1 font-medium">Active Competitors</p>
              </div>
              <div className="bg-surface/80 border border-border p-5 rounded-2xl">
                <p className="text-3xl font-extrabold text-blue-400 tracking-tight">{contestCount}</p>
                <p className="text-xs text-text-secondary uppercase tracking-wider mt-1 font-medium">Rated Contests</p>
              </div>
              <div className="bg-surface/80 border border-border p-5 rounded-2xl">
                <p className="text-3xl font-extrabold text-green-400 tracking-tight">4</p>
                <p className="text-xs text-text-secondary uppercase tracking-wider mt-1 font-medium">Languages (JS, Py, C++, Java)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="py-20 border-b border-border/60 bg-surface/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                Engineered for High-Standard Engineering
              </h2>
              <p className="text-sm text-text-secondary mt-2">
                Designed from first principles to reflect authentic tournament conditions and interview rigour.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card hover className="p-6">
                <div className="w-10 h-10 rounded-xl bg-accent-600/20 border border-accent-500/30 flex items-center justify-center text-accent-400 mb-4">
                  <Terminal className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Monaco Code Studio</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Full VS Code-grade editing in Python 3, Node.js, C++20, and Java 17 with instant syntax validation and standard input/output execution.
                </p>
              </Card>

              <Card hover className="p-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                  <Trophy className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Live Contests & Ranks</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Scheduled time-gated rounds with automated scoring, penalty calculations, dynamic rating updates, and live leaderboards.
                </p>
              </Card>

              <Card hover className="p-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 mb-4">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Secure Judge Architecture</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Sandboxed, configurable Judge0 backend adapter with zero server-process execution vulnerabilities and graceful transparent demo mode.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Problems Preview */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Featured Challenges</h2>
              <p className="text-sm text-text-secondary mt-1">Jump right in and solve classic algorithmic benchmarks.</p>
            </div>
            <Link href="/problems">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                View All Problems
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredProblems.map((p) => {
              const diffColor =
                p.difficulty === 'EASY'
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : p.difficulty === 'MEDIUM'
                  ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'

              return (
                <Link key={p.id} href={`/problems/${p.slug}`}>
                  <Card hover className="p-5 flex items-center justify-between group">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${diffColor}`}>
                          {p.difficulty}
                        </span>
                        <span className="text-xs text-text-muted">{p.category}</span>
                      </div>
                      <h3 className="text-base font-semibold text-text-primary group-hover:text-accent-400 transition-colors">
                        {p.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-medium text-text-secondary">{p.points} pts</span>
                      <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* CTA banner */}
        <section className="py-16 bg-gradient-to-b from-surface/40 to-surface/90 border-t border-border mt-auto">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-text-primary mb-3">Ready to claim your ranking?</h2>
            <p className="text-sm text-text-secondary max-w-xl mx-auto mb-6">
              Create your account in seconds, track your solving streak, earn prestigious achievements, and prepare for top-tier competitive rounds.
            </p>
            <div className="flex justify-center gap-3">
              <Link href="/register">
                <Button size="md" variant="primary">Create Free Account</Button>
              </Link>
              <Link href="/leaderboard">
                <Button size="md" variant="secondary">Explore Leaderboard</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
