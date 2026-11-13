'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DifficultyBadge } from '@/components/problems/DifficultyBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { 
  Search, 
  CheckCircle2, 
  CircleDot, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  X
} from 'lucide-react'

interface ProblemItem {
  id: string
  slug: string
  title: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  category: string
  tags: string[]
  points: number
  solvedCount?: number
  userStatus?: 'SOLVED' | 'ATTEMPTED' | null
}

const CATEGORIES = [
  'ALL',
  'Arrays',
  'Strings',
  'Dynamic Programming',
  'Graphs',
  'Binary Search',
  'Linked Lists',
  'Stack',
  'Backtracking',
  'Trees',
]

export default function ProblemsCatalogPage() {
  const [problems, setProblems] = useState<ProblemItem[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Filters
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('ALL')
  const [category, setCategory] = useState('ALL')
  const [sortBy, setSortBy] = useState<'points-asc' | 'points-desc' | 'title'>('points-asc')

  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '15')
      if (difficulty !== 'ALL') params.set('difficulty', difficulty)
      if (category !== 'ALL') params.set('category', category)
      if (search.trim()) params.set('search', search.trim())

      const res = await fetch(`/api/problems?${params.toString()}`)
      const data = await res.json()

      if (res.ok) {
        let list: ProblemItem[] = data.problems || []
        // Client-side sort
        if (sortBy === 'points-asc') {
          list.sort((a, b) => a.points - b.points)
        } else if (sortBy === 'points-desc') {
          list.sort((a, b) => b.points - a.points)
        } else if (sortBy === 'title') {
          list.sort((a, b) => a.title.localeCompare(b.title))
        }

        setProblems(list)
        setTotal(data.total || 0)
        setTotalPages(data.totalPages || 1)
      }
    } catch (err) {
      console.error('Error fetching problems:', err)
    } finally {
      setLoading(false)
    }
  }, [page, difficulty, category, search, sortBy])

  useEffect(() => {
    fetchProblems()
  }, [fetchProblems])

  const handleClearFilters = () => {
    setSearch('')
    setDifficulty('ALL')
    setCategory('ALL')
    setPage(1)
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-accent-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="h-4 w-4" />
            <span>Problem Archive</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
            Algorithmic Challenges
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">
            Sharpen your problem-solving capabilities across diverse computational domains and difficulty tiers.
          </p>
        </div>

        {/* Search & Filters Card */}
        <Card className="mb-6 p-4 bg-surface/80 border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="lg:col-span-1">
              <Input
                placeholder="Search challenges..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>

            {/* Difficulty */}
            <div>
              <Select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value)
                  setPage(1)
                }}
                options={[
                  { value: 'ALL', label: 'All Difficulties' },
                  { value: 'EASY', label: 'Easy' },
                  { value: 'MEDIUM', label: 'Medium' },
                  { value: 'HARD', label: 'Hard' },
                ]}
              />
            </div>

            {/* Category */}
            <div>
              <Select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                  setPage(1)
                }}
                options={CATEGORIES.map((cat) => ({
                  value: cat,
                  label: cat === 'ALL' ? 'All Categories' : cat,
                }))}
              />
            </div>

            {/* Sort */}
            <div>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                options={[
                  { value: 'points-asc', label: 'Points: Low to High' },
                  { value: 'points-desc', label: 'Points: High to Low' },
                  { value: 'title', label: 'Alphabetical' },
                ]}
              />
            </div>
          </div>

          {(search || difficulty !== 'ALL' || category !== 'ALL') && (
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
              <span>Showing filtered results</span>
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 text-accent-400 hover:text-accent-300 font-medium"
              >
                <X className="h-3.5 w-3.5" />
                Clear Filters
              </button>
            </div>
          )}
        </Card>

        {/* Problems Table / List */}
        {loading ? (
          <PageLoader text="Loading problems catalog..." />
        ) : problems.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="h-6 w-6" />}
            title="No matching problems found"
            description="Try modifying your search keywords or clearing active difficulty/category filters."
            action={
              <Button size="sm" variant="secondary" onClick={handleClearFilters}>
                Reset Filters
              </Button>
            }
          />
        ) : (
          <div className="border border-border rounded-xl bg-surface overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2/60 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    <th className="py-3 px-4 w-12 text-center">Status</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4 text-center">Points</th>
                    <th className="py-3 px-4 text-right">Submissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {problems.map((prob) => {
                    return (
                      <tr
                        key={prob.id}
                        className="hover:bg-surface-2/40 transition-colors group cursor-pointer"
                      >
                        {/* Status Icon */}
                        <td className="py-3.5 px-4 text-center">
                          {prob.userStatus === 'SOLVED' ? (
                            <span title="Solved"><CheckCircle2 className="h-4 w-4 text-green-400 mx-auto" /></span>
                          ) : prob.userStatus === 'ATTEMPTED' ? (
                            <span title="Attempted"><CircleDot className="h-4 w-4 text-yellow-400 mx-auto" /></span>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-border block mx-auto" />
                          )}
                        </td>

                        {/* Title & Tags */}
                        <td className="py-3.5 px-4">
                          <Link href={`/problems/${prob.slug}`} className="block">
                            <span className="font-semibold text-text-primary group-hover:text-accent-400 transition-colors">
                              {prob.title}
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {prob.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] text-text-muted bg-surface-2 px-1.5 py-0.5 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </Link>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 text-text-secondary text-xs">
                          {prob.category}
                        </td>

                        {/* Difficulty */}
                        <td className="py-3.5 px-4">
                          <DifficultyBadge difficulty={prob.difficulty} />
                        </td>

                        {/* Points */}
                        <td className="py-3.5 px-4 text-center font-mono font-medium text-xs text-accent-400">
                          {prob.points}
                        </td>

                        {/* Submissions */}
                        <td className="py-3.5 px-4 text-right text-text-muted text-xs font-mono">
                          {prob.solvedCount || 0}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border bg-surface-2/30 text-xs text-text-secondary">
                <span>
                  Showing page <strong className="text-text-primary">{page}</strong> of{' '}
                  <strong className="text-text-primary">{totalPages}</strong> ({total} total problems)
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
