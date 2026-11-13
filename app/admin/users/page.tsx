'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Spinner'
import { Users, ArrowLeft, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { formatDate, getRatingColor, getRatingTitle } from '@/lib/utils'

interface AdminUser {
  id: string
  username: string
  email: string
  displayName: string | null
  role: string
  rating: number
  createdAt: string
  _count: {
    submissions: number
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/users?page=${page}&limit=20`)
      const data = await res.json()
      if (res.ok) {
        setUsers(data.users || [])
        setTotal(data.total || 0)
        setTotalPages(data.totalPages || 1)
      }
    } catch (err) {
      console.error('Error fetching admin users:', err)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        <div>
          <Link href="/admin" className="text-xs text-text-muted hover:text-text-primary flex items-center gap-1 mb-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin Console
          </Link>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Directory of registered competitive developers and system administrators.
          </p>
        </div>

        {loading ? (
          <PageLoader text="Loading registered users..." />
        ) : (
          <div className="border border-border rounded-xl bg-surface overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2/60 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Elo Rating</th>
                    <th className="py-3 px-4 text-center">Submissions</th>
                    <th className="py-3 px-4">Member Since</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-2/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link href={`/u/${u.username}`} className="font-semibold text-text-primary hover:text-accent-400 transition-colors">
                          {u.displayName || u.username}
                        </Link>
                        <span className="text-xs text-text-muted font-mono block">@{u.username}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-text-secondary">
                        {u.email}
                      </td>
                      <td className="py-3.5 px-4">
                        {u.role === 'ADMIN' ? (
                          <Badge variant="purple">ADMIN</Badge>
                        ) : (
                          <Badge variant="default">USER</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span className={getRatingColor(u.rating)}>
                          {u.rating} ({getRatingTitle(u.rating)})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-text-secondary">
                        {u._count.submissions}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-text-muted">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link href={`/u/${u.username}`}>
                          <Button variant="ghost" size="xs" leftIcon={<Eye className="h-3.5 w-3.5" />}>
                            Profile
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border bg-surface-2/30 text-xs text-text-secondary">
                <span>
                  Showing page <strong className="text-text-primary">{page}</strong> of{' '}
                  <strong className="text-text-primary">{totalPages}</strong> ({total} total users)
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
