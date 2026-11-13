'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { DifficultyBadge } from '@/components/problems/DifficultyBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { Plus, Trash2, ArrowLeft, BookOpen, Check, X, Shield, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminProblem {
  id: string
  slug: string
  title: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  category: string
  points: number
  timeLimit: number
  memoryLimit: number
  isPublished: boolean
  createdAt: string
  _count: {
    submissions: number
    testCases: number
  }
}

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState<AdminProblem[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY')
  const [category, setCategory] = useState('Arrays')
  const [tags, setTags] = useState('Array, Hash Table')
  const [constraints, setConstraints] = useState('- 1 <= n <= 10^5')
  const [inputFormat, setInputFormat] = useState('Single line of space-separated integers')
  const [outputFormat, setOutputFormat] = useState('Single integer result')
  const [points, setPoints] = useState(100)
  const [timeLimit, setTimeLimit] = useState(1000)
  const [memoryLimit, setMemoryLimit] = useState(256)

  const fetchProblems = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/problems')
      if (res.status === 403) {
        toast.error('Admin permissions required')
        return
      }
      const data = await res.json()
      if (res.ok) {
        setProblems(data.problems || [])
      }
    } catch (err) {
      console.error('Failed to load admin problems:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProblems()
  }, [])

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean)

      const res = await fetch('/api/admin/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          description,
          difficulty,
          category,
          tags: parsedTags,
          constraints,
          inputFormat,
          outputFormat,
          points: Number(points),
          timeLimit: Number(timeLimit),
          memoryLimit: Number(memoryLimit),
          examples: [{ input: '1 2 3', output: '3', explanation: 'Sample test' }],
        }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success('Problem created successfully!')
        setIsModalOpen(false)
        // Reset form
        setTitle('')
        setSlug('')
        setDescription('')
        fetchProblems()
      } else {
        toast.error(data.error || 'Failed to create problem')
      }
    } catch {
      toast.error('Network error creating problem')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return

    try {
      const res = await fetch(`/api/admin/problems/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Problem deleted')
        setProblems(problems.filter((p) => p.id !== id))
      } else {
        toast.error('Failed to delete problem')
      }
    } catch {
      toast.error('Error deleting problem')
    }
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href="/admin" className="text-xs text-text-muted hover:text-text-primary flex items-center gap-1 mb-2">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Admin Console
            </Link>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
              Problem Management
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Add new coding challenges, adjust parameters, and supervise platform content.
            </p>
          </div>

          <Button
            size="md"
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Create New Problem
          </Button>
        </div>

        {/* Problems list */}
        {loading ? (
          <PageLoader text="Loading problem inventory..." />
        ) : (
          <div className="border border-border rounded-xl bg-surface overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2/60 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-center">Points</th>
                    <th className="py-3 px-4 text-center">Limits</th>
                    <th className="py-3 px-4 text-center">Submissions</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {problems.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-2/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link href={`/problems/${p.slug}`} className="font-semibold text-text-primary hover:text-accent-400 transition-colors">
                          {p.title}
                        </Link>
                        <span className="text-xs text-text-muted font-mono block">/{p.slug}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <DifficultyBadge difficulty={p.difficulty} />
                      </td>
                      <td className="py-3.5 px-4 text-xs text-text-secondary">
                        {p.category}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-accent-400">
                        {p.points}
                      </td>
                      <td className="py-3.5 px-4 text-center text-xs font-mono text-text-muted">
                        {p.timeLimit}ms / {p.memoryLimit}MB
                      </td>
                      <td className="py-3.5 px-4 text-center text-xs font-mono text-text-secondary">
                        {p._count.submissions}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Link href={`/problems/${p.slug}`}>
                          <Button variant="ghost" size="xs" leftIcon={<Eye className="h-3.5 w-3.5" />}>
                            Solve
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="xs"
                          onClick={() => handleDelete(p.id, p.title)}
                          leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create Problem Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Algorithmic Challenge"
          description="Fill out the specifications below to publish a new challenge to the arena."
          size="lg"
        >
          <form onSubmit={handleCreateProblem} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Problem Title"
                placeholder="e.g. Reverse Bits"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />

              <Input
                label="URL Slug (Kebab Case)"
                placeholder="reverse-bits"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>

            <Textarea
              label="Problem Statement & Description"
              placeholder="Provide a clear, detailed algorithmic explanation of the challenge..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                options={[
                  { value: 'EASY', label: 'Easy' },
                  { value: 'MEDIUM', label: 'Medium' },
                  { value: 'HARD', label: 'Hard' },
                ]}
              />

              <Input
                label="Category"
                placeholder="e.g. Dynamic Programming"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />

              <Input
                label="Points"
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                required
              />
            </div>

            <Input
              label="Tags (Comma Separated)"
              placeholder="Array, Hash Table, Two Pointers"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Time Limit (ms)"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
              />

              <Input
                label="Memory Limit (MB)"
                type="number"
                value={memoryLimit}
                onChange={(e) => setMemoryLimit(Number(e.target.value))}
              />
            </div>

            <Textarea
              label="Constraints"
              placeholder="- 1 <= n <= 10^5"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              rows={2}
            />

            <div className="pt-3 border-t border-border flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Publish Problem
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  )
}
