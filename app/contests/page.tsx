'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { Trophy, Calendar, Clock, Users, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface ContestItem {
  id: string
  slug: string
  title: string
  description: string
  startTime: string
  endTime: string
  status: 'ACTIVE' | 'UPCOMING' | 'PAST'
  participantsCount: number
  problemsCount: number
}

export default function ContestsPage() {
  const [contests, setContests] = useState<ContestItem[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'past'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadContests() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (filter !== 'all') params.set('status', filter)
        const res = await fetch(`/api/contests?${params.toString()}`)
        const data = await res.json()
        if (res.ok) {
          setContests(data.contests || [])
        }
      } catch (err) {
        console.error('Error fetching contests:', err)
      } finally {
        setLoading(false)
      }
    }

    loadContests()
  }, [filter])

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-accent-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Trophy className="h-4 w-4" />
            <span>Competitive Arena</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Programming Contests
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">
            Test your algorithmic agility in real-time time-gated rounds. Compete against global developers and ascend the rating ladder.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 border-b border-border pb-3 mb-6">
          {(['all', 'active', 'upcoming', 'past'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filter === tab
                  ? 'bg-accent-600 text-white shadow-sm'
                  : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-2'
              }`}
            >
              {tab === 'all' ? 'All Contests' : tab}
            </button>
          ))}
        </div>

        {/* Contest Cards */}
        {loading ? (
          <PageLoader text="Loading contests..." />
        ) : contests.length === 0 ? (
          <EmptyState
            icon={<Trophy className="h-6 w-6" />}
            title="No contests in this category"
            description="Check back soon for upcoming tournament rounds or explore past contests."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => {
              const start = new Date(contest.startTime)
              const end = new Date(contest.endTime)
              const durationHours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60))

              let statusBadge = <Badge variant="info">Upcoming</Badge>
              if (contest.status === 'ACTIVE') {
                statusBadge = <Badge variant="success" className="animate-pulse">Live Now</Badge>
              } else if (contest.status === 'PAST') {
                statusBadge = <Badge variant="default">Completed</Badge>
              }

              return (
                <Card key={contest.id} hover className="flex flex-col justify-between p-6 group">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {statusBadge}
                      <span className="text-xs text-text-muted font-mono">{durationHours} Hours</span>
                    </div>

                    <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-400 transition-colors mb-2">
                      {contest.title}
                    </h3>

                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-4">
                      {contest.description}
                    </p>

                    <div className="space-y-2 text-xs text-text-muted font-mono pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-text-muted" />
                        <span>Start: {formatDateTime(contest.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-text-muted" />
                        <span>{contest.participantsCount} Registered Competitors</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-accent-400 font-semibold">
                      {contest.problemsCount} Challenges
                    </span>
                    <Link href={`/contests/${contest.slug}`}>
                      <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                        {contest.status === 'ACTIVE' ? 'Enter Contest' : 'Details & Rank'}
                      </Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
