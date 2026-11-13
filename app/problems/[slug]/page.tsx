import React from 'react'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { Navbar } from '@/components/layout/Navbar'
import { DifficultyBadge } from '@/components/problems/DifficultyBadge'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { parseTags, parseExamples } from '@/lib/utils'
import { Clock, Cpu, Award, BookOpen, Layers, CheckCircle2, History } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: { slug: string }
  searchParams?: { contestId?: string }
}

export async function generateMetadata({ params }: PageProps) {
  const problem = await prisma.problem.findUnique({
    where: { slug: params.slug },
    select: { title: true, difficulty: true },
  })

  if (!problem) return { title: 'Problem Not Found | DevArena' }

  return {
    title: `${problem.title} (${problem.difficulty}) | DevArena`,
  }
}

export default async function ProblemDetailPage({ params, searchParams }: PageProps) {
  const user = await getCurrentUser()

  const problem = await prisma.problem.findUnique({
    where: { slug: params.slug },
    include: {
      testCases: {
        orderBy: { orderIndex: 'asc' },
      },
      submissions: user ? {
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
      } : false,
    },
  })

  if (!problem || !problem.isPublished) {
    notFound()
  }

  const tags = parseTags(problem.tags)
  const examples = parseExamples(problem.examples)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar user={user} />

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Problem Statement & Metadata */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-hidden">
          <div className="bg-surface border border-border rounded-xl p-6 overflow-y-auto max-h-[calc(100vh-6rem)] space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <DifficultyBadge difficulty={problem.difficulty} />
                <span className="text-xs text-text-secondary bg-surface-2 px-2 py-0.5 rounded border border-border">
                  {problem.category}
                </span>
                <span className="text-xs font-mono text-accent-400 font-semibold ml-auto flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" />
                  {problem.points} pts
                </span>
              </div>
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                {problem.title}
              </h1>
            </div>

            {/* Specifications ribbon */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-text-secondary p-3 bg-surface-2/60 rounded-lg border border-border">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-text-muted" />
                <span>Time Limit: {problem.timeLimit}ms</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-text-muted" />
                <span>Memory: {problem.memoryLimit}MB</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" /> Description
              </h3>
              <div className="text-sm text-text-primary/90 leading-relaxed whitespace-pre-line font-sans">
                {problem.description}
              </div>
            </div>

            {/* Input & Output format */}
            {(problem.inputFormat || problem.outputFormat) && (
              <div className="space-y-4 pt-2 border-t border-border">
                {problem.inputFormat && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Input Format</h4>
                    <p className="text-xs text-text-secondary leading-relaxed bg-surface-2 p-2.5 rounded-lg border border-border font-mono">
                      {problem.inputFormat}
                    </p>
                  </div>
                )}
                {problem.outputFormat && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Output Format</h4>
                    <p className="text-xs text-text-secondary leading-relaxed bg-surface-2 p-2.5 rounded-lg border border-border font-mono">
                      {problem.outputFormat}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Examples */}
            {examples.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Examples</h3>
                {examples.map((ex, idx) => (
                  <div key={idx} className="bg-surface-2/80 border border-border rounded-lg p-3 text-xs font-mono space-y-2">
                    <span className="text-[11px] font-semibold text-accent-400 block">Example {idx + 1}</span>
                    <div>
                      <span className="text-text-muted text-[10px] uppercase block mb-0.5">Input:</span>
                      <pre className="p-2 bg-background/80 rounded border border-border text-text-primary whitespace-pre-wrap">
                        {ex.input || '(empty)'}
                      </pre>
                    </div>
                    <div>
                      <span className="text-text-muted text-[10px] uppercase block mb-0.5">Output:</span>
                      <pre className="p-2 bg-background/80 rounded border border-border text-text-primary whitespace-pre-wrap">
                        {ex.output}
                      </pre>
                    </div>
                    {ex.explanation && (
                      <p className="text-[11px] text-text-muted font-sans italic pt-1">
                        <strong>Explanation:</strong> {ex.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Constraints */}
            {problem.constraints && (
              <div className="space-y-2 pt-2 border-t border-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Constraints</h3>
                <pre className="text-xs font-mono text-text-secondary bg-surface-2 p-3 rounded-lg border border-border whitespace-pre-wrap leading-relaxed">
                  {problem.constraints}
                </pre>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="pt-2 border-t border-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Related Topics</h3>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="text-xs bg-surface-2 text-text-secondary px-2.5 py-1 rounded-md border border-border">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Submissions by this user */}
            {user && Array.isArray(problem.submissions) && problem.submissions.length > 0 && (
              <div className="pt-2 border-t border-border space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5" /> Your Submissions
                  </h3>
                  <Link href="/submissions" className="text-[11px] text-accent-400 hover:underline">
                    View all
                  </Link>
                </div>
                <div className="space-y-1.5">
                  {problem.submissions.map((sub: any) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface-2/60 border border-border text-xs"
                    >
                      <span className={`font-semibold ${sub.status === 'ACCEPTED' ? 'text-green-400' : 'text-red-400'}`}>
                        {sub.status}
                      </span>
                      <span className="font-mono text-text-muted">{sub.language}</span>
                      <span className="text-text-muted font-mono">{sub.runtime ? `${sub.runtime}ms` : '-'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Studio & Monaco Editor */}
        <div className="lg:col-span-7 flex flex-col h-[calc(100vh-6rem)]">
          <CodeEditor
            problemId={problem.id}
            slug={problem.slug}
            testCases={problem.testCases.map((tc) => ({
              id: tc.id,
              input: tc.input,
              expected: tc.expected,
              isSample: tc.isSample,
            }))}
            contestId={searchParams?.contestId}
          />
        </div>
      </div>
    </div>
  )
}
