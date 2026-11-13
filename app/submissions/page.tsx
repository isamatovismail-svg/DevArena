'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/problems/StatusBadge'
import { DifficultyBadge } from '@/components/problems/DifficultyBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { History, ChevronLeft, ChevronRight, Code2, Clock, Cpu, Eye, CheckCircle2, XCircle } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface SubmissionItem {
  id: string
  problemId: string
  code: string
  language: string
  status: string
  runtime: number | null
  memory: number | null
  output: string | null
  errorMessage: string | null
  testResults: string | null
  createdAt: string
  problem: {
    title: string
    slug: string
    difficulty: string
    points: number
  }
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Inspection modal
  const [selectedSub, setSelectedSub] = useState<SubmissionItem | null>(null)

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/submissions?page=${page}&limit=15`)
      const data = await res.json()
      if (res.ok) {
        setSubmissions(data.submissions || [])
        setTotal(data.total || 0)
        setTotalPages(data.totalPages || 1)
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  let parsedTestResults: any[] = []
  if (selectedSub?.testResults) {
    try {
      parsedTestResults = JSON.parse(selectedSub.testResults)
    } catch {}
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        <div>
          <div className="flex items-center gap-2 text-accent-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <History className="h-4 w-4" />
            <span>Execution Audit</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Submission History
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Audit your past attempts, test results, execution runtimes, and memory utilization.
          </p>
        </div>

        {loading ? (
          <PageLoader text="Loading submission history..." />
        ) : submissions.length === 0 ? (
          <EmptyState
            icon={<Code2 className="h-6 w-6" />}
            title="No submissions recorded yet"
            description="You haven't submitted any code yet. Browse the problems catalog to make your first solve."
            action={
              <Link href="/problems">
                <Button size="sm">Browse Problems</Button>
              </Link>
            }
          />
        ) : (
          <div className="border border-border rounded-xl bg-surface overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2/60 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <th className="py-3 px-4">Problem</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Language</th>
                    <th className="py-3 px-4">Runtime</th>
                    <th className="py-3 px-4">Memory</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-surface-2/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/problems/${sub.problem.slug}`}
                          className="font-semibold text-text-primary hover:text-accent-400 transition-colors"
                        >
                          {sub.problem.title}
                        </Link>
                        <div className="mt-0.5">
                          <DifficultyBadge difficulty={sub.problem.difficulty} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-text-secondary">
                        {sub.language}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-text-muted">
                        {sub.runtime !== null ? `${sub.runtime} ms` : '-'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-text-muted">
                        {sub.memory !== null ? `${(sub.memory / 1024).toFixed(1)} MB` : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-text-muted">
                        {formatDateTime(sub.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setSelectedSub(sub)}
                          leftIcon={<Eye className="h-3.5 w-3.5" />}
                        >
                          View
                        </Button>
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
                  <strong className="text-text-primary">{totalPages}</strong> ({total} total submissions)
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

        {/* Inspection Modal */}
        <Modal
          isOpen={Boolean(selectedSub)}
          onClose={() => setSelectedSub(null)}
          title={selectedSub ? `Submission: ${selectedSub.problem.title}` : ''}
          description={selectedSub ? `${selectedSub.language.toUpperCase()} • ${formatDateTime(selectedSub.createdAt)}` : ''}
          size="lg"
        >
          {selectedSub && (
            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <StatusBadge status={selectedSub.status} />
                <div className="flex items-center gap-3 text-text-secondary">
                  {selectedSub.runtime !== null && <span>Runtime: {selectedSub.runtime}ms</span>}
                  {selectedSub.memory !== null && <span>Memory: {(selectedSub.memory / 1024).toFixed(1)}MB</span>}
                </div>
              </div>

              {selectedSub.errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-lg text-red-300 whitespace-pre-wrap">
                  <span className="font-semibold block mb-1">Compiler / Runtime Output:</span>
                  {selectedSub.errorMessage}
                </div>
              )}

              {parsedTestResults.length > 0 && (
                <div className="space-y-2">
                  <span className="text-text-muted uppercase text-[10px] tracking-wider block">Test Results</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {parsedTestResults.map((tr: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg border flex items-center justify-between ${
                          tr.passed
                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}
                      >
                        <span>Test {idx + 1}</span>
                        {tr.passed ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-text-muted uppercase text-[10px] tracking-wider block mb-1.5">Submitted Source Code</span>
                <pre className="p-4 bg-surface-2 rounded-xl border border-border text-text-primary whitespace-pre-wrap overflow-x-auto max-h-80">
                  {selectedSub.code}
                </pre>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  )
}
