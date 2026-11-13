'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Spinner'
import { Trophy, Plus, ArrowLeft, Calendar, Users, Eye } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'

interface AdminContest {
  id: string
  slug: string
  title: string
  description: string
  startTime: string
  endTime: string
  isPublished: boolean
  _count: {
    contestParticipants: number
    contestProblems: number
    submissions: number
  }
}

interface ProblemOption {
  id: string
  title: string
  difficulty: string
}

export default function AdminContestsPage() {
  const [contests, setContests] = useState<AdminContest[]>([])
  const [problems, setProblems] = useState<ProblemOption[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([])

  const fetchContests = async () => {
    try {
      setLoading(true)
      const [cRes, pRes] = await Promise.all([
        fetch('/api/admin/contests'),
        fetch('/api/problems?limit=50'),
      ])
      const cData = await cRes.json()
      const pData = await pRes.json()
      if (cRes.ok) setContests(cData.contests || [])
      if (pRes.ok) setProblems(pData.problems || [])
    } catch (err) {
      console.error('Failed to load admin contests:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContests()
  }, [])

  const handleTitleChange = (val: string) => {
    setTitle(val)
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
  }

  const toggleProblemSelection = (id: string) => {
    if (selectedProblemIds.includes(id)) {
      setSelectedProblemIds(selectedProblemIds.filter((p) => p !== id))
    } else {
      setSelectedProblemIds([...selectedProblemIds, id])
    }
  }

  const handleCreateContest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedProblemIds.length === 0) {
      toast.error('Select at least one problem for this contest')
      return
    }

    try {
      setIsSubmitting(true)
      const res = await fetch('/api/admin/contests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          description,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          problemIds: selectedProblemIds,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success('Contest scheduled successfully!')
        setIsModalOpen(false)
        setTitle('')
        setSlug('')
        setDescription('')
        setSelectedProblemIds([])
        fetchContests()
      } else {
        toast.error(data.error || 'Failed to create contest')
      }
    } catch {
      toast.error('Network error creating contest')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/admin" className="text-xs text-text-muted hover:text-text-primary flex items-center gap-1 mb-2">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin Console
            </Link>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
              Contest Operations
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Schedule official competitive rounds, assemble tournament problem sets, and inspect submissions.
            </p>
          </div>

          <Button
            size="md"
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Schedule Contest
          </Button>
        </div>

        {loading ? (
          <PageLoader text="Loading contest schedule..." />
        ) : (
          <div className="border border-border rounded-xl bg-surface overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2/60 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Timeline</th>
                    <th className="py-3 px-4 text-center">Problems</th>
                    <th className="py-3 px-4 text-center">Participants</th>
                    <th className="py-3 px-4 text-center">Submissions</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {contests.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-2/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link href={`/contests/${c.slug}`} className="font-semibold text-text-primary hover:text-accent-400 transition-colors">
                          {c.title}
                        </Link>
                        <span className="text-xs text-text-muted font-mono block">/{c.slug}</span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-text-secondary">
                        <div>Start: {formatDateTime(c.startTime)}</div>
                        <div className="text-text-muted">End: {formatDateTime(c.endTime)}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-accent-400">
                        {c._count.contestProblems}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-text-secondary">
                        {c._count.contestParticipants}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-text-secondary">
                        {c._count.submissions}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link href={`/contests/${c.slug}`}>
                          <Button variant="ghost" size="xs" leftIcon={<Eye className="h-3.5 w-3.5" />}>
                            View Arena
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Schedule Contest Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Schedule Competitive Round"
          description="Configure the tournament parameters and choose problems."
          size="lg"
        >
          <form onSubmit={handleCreateContest} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Contest Title"
                placeholder="e.g. Weekly Contest #3"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />

              <Input
                label="Contest Slug"
                placeholder="weekly-contest-3"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>

            <Textarea
              label="Description"
              placeholder="Contest format, target audience, scoring rules..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Start Time"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />

              <Input
                label="End Time"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>

            {/* Problem Multi-Selector */}
            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
                Select Contest Problems ({selectedProblemIds.length} chosen)
              </label>
              <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-surface-2 rounded-lg border border-border">
                {problems.map((p) => {
                  const isSelected = selectedProblemIds.includes(p.id)
                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleProblemSelection(p.id)}
                      className={`p-2 rounded flex items-center justify-between text-xs cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-accent-600/20 text-accent-400 border border-accent-500/30'
                          : 'hover:bg-surface-3 text-text-secondary'
                      }`}
                    >
                      <span className="font-medium">{p.title}</span>
                      <span className="text-[10px] font-mono uppercase">{p.difficulty}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Schedule Contest
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  )
}
