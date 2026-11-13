'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/Spinner'
import { Trophy, ChevronLeft, ChevronRight, Award, User, Flame } from 'lucide-react'
import { getRatingColor, getRatingTitle } from '@/lib/utils'

interface LeaderboardUser {
  id: string
  username: string
  displayName: string | null
  avatarUrl: string | null
  rating: number
  role: string
  rank: number
  solvedCount: number
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/leaderboard?page=${page}&limit=25`)
      const data = await res.json()
      if (res.ok) {
        setUsers(data.leaderboard || [])
        setTotal(data.total || 0)
        setTotalPages(data.totalPages || 1)
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-accent-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Trophy className="h-4 w-4" />
            <span>Global Rankings</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Developer Leaderboard
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">
            Real-time global Elo ratings and problem solves across the competitive community.
          </p>
        </div>

        {/* Podium Top 3 Showcase */}
        {!loading && users.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Rank 2 */}
            <Card className="order-2 md:order-1 p-6 text-center border-slate-700/50 bg-gradient-to-t from-surface to-surface-2 flex flex-col items-center">
              <span className="text-2xl mb-2">🥈</span>
              <div className="w-12 h-12 rounded-xl bg-slate-400/20 text-slate-300 font-bold flex items-center justify-center text-lg mb-2">
                {users[1].username.charAt(0).toUpperCase()}
              </div>
              <Link href={`/u/${users[1].username}`} className="font-bold text-text-primary hover:text-accent-400 transition-colors">
                {users[1].displayName || users[1].username}
              </Link>
              <span className="text-xs text-text-muted font-mono mb-2">@{users[1].username}</span>
              <div className={`text-sm font-bold ${getRatingColor(users[1].rating)}`}>
                {users[1].rating} <span className="text-xs font-normal">({getRatingTitle(users[1].rating)})</span>
              </div>
              <span className="text-xs text-text-muted mt-2 font-mono">{users[1].solvedCount} Solved</span>
            </Card>

            {/* Rank 1 */}
            <Card className="order-1 md:order-2 p-6 text-center border-yellow-500/40 bg-gradient-to-t from-yellow-500/10 to-surface-2 relative flex flex-col items-center scale-105 z-10 shadow-xl shadow-yellow-500/5">
              <span className="text-3xl mb-1">👑</span>
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 text-yellow-300 font-extrabold flex items-center justify-center text-xl mb-2 ring-2 ring-yellow-500/50">
                {users[0].username.charAt(0).toUpperCase()}
              </div>
              <Link href={`/u/${users[0].username}`} className="font-bold text-lg text-text-primary hover:text-accent-400 transition-colors">
                {users[0].displayName || users[0].username}
              </Link>
              <span className="text-xs text-text-muted font-mono mb-2">@{users[0].username}</span>
              <div className={`text-base font-extrabold ${getRatingColor(users[0].rating)}`}>
                {users[0].rating} <span className="text-xs font-normal">({getRatingTitle(users[0].rating)})</span>
              </div>
              <span className="text-xs text-text-muted mt-2 font-mono font-medium">{users[0].solvedCount} Problems Solved</span>
            </Card>

            {/* Rank 3 */}
            <Card className="order-3 md:order-3 p-6 text-center border-amber-800/50 bg-gradient-to-t from-surface to-surface-2 flex flex-col items-center">
              <span className="text-2xl mb-2">🥉</span>
              <div className="w-12 h-12 rounded-xl bg-amber-700/20 text-amber-500 font-bold flex items-center justify-center text-lg mb-2">
                {users[2].username.charAt(0).toUpperCase()}
              </div>
              <Link href={`/u/${users[2].username}`} className="font-bold text-text-primary hover:text-accent-400 transition-colors">
                {users[2].displayName || users[2].username}
              </Link>
              <span className="text-xs text-text-muted font-mono mb-2">@{users[2].username}</span>
              <div className={`text-sm font-bold ${getRatingColor(users[2].rating)}`}>
                {users[2].rating} <span className="text-xs font-normal">({getRatingTitle(users[2].rating)})</span>
              </div>
              <span className="text-xs text-text-muted mt-2 font-mono">{users[2].solvedCount} Solved</span>
            </Card>
          </div>
        )}

        {/* Global Standings Table */}
        {loading ? (
          <PageLoader text="Computing rankings..." />
        ) : (
          <div className="border border-border rounded-xl bg-surface overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2/60 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <th className="py-3 px-4 w-16 text-center">Rank</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Division Title</th>
                    <th className="py-3 px-4 text-right">Problems Solved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-2/40 transition-colors group">
                      <td className="py-3.5 px-4 text-center font-bold text-xs font-mono">
                        {u.rank <= 3 ? (
                          u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : '🥉'
                        ) : (
                          `#${u.rank}`
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <Link href={`/u/${u.username}`} className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-xs font-bold text-accent-400">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-text-primary group-hover:text-accent-400 transition-colors">
                              {u.displayName || u.username}
                            </span>
                            <span className="text-xs text-text-muted font-mono block">@{u.username}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span className={getRatingColor(u.rating)}>{u.rating}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-text-secondary">
                        {getRatingTitle(u.rating)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-medium text-text-primary">
                        {u.solvedCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border bg-surface-2/30 text-xs text-text-secondary">
                <span>
                  Showing page <strong className="text-text-primary">{page}</strong> of{' '}
                  <strong className="text-text-primary">{totalPages}</strong> ({total} competitors)
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="xs"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    size="xs"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
