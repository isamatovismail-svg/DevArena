import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

export function formatMemory(kb: number): string {
  if (kb < 1024) return `${kb} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toUpperCase()) {
    case 'EASY': return 'text-green-400'
    case 'MEDIUM': return 'text-yellow-400'
    case 'HARD': return 'text-red-400'
    default: return 'text-text-secondary'
  }
}

export function getDifficultyBg(difficulty: string): string {
  switch (difficulty.toUpperCase()) {
    case 'EASY': return 'bg-green-500/10 text-green-400 border-green-500/20'
    case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    case 'HARD': return 'bg-red-500/10 text-red-400 border-red-500/20'
    default: return 'bg-surface-2 text-text-secondary border-border'
  }
}

export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACCEPTED': return 'text-green-400'
    case 'WRONG_ANSWER': return 'text-red-400'
    case 'TIME_LIMIT_EXCEEDED': return 'text-yellow-400'
    case 'COMPILATION_ERROR': return 'text-orange-400'
    case 'RUNTIME_ERROR': return 'text-red-400'
    case 'PENDING': return 'text-text-secondary'
    case 'RUNNING': return 'text-blue-400'
    default: return 'text-text-secondary'
  }
}

export function getStatusBg(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACCEPTED': return 'bg-green-500/10 text-green-400 border-green-500/20'
    case 'WRONG_ANSWER': return 'bg-red-500/10 text-red-400 border-red-500/20'
    case 'TIME_LIMIT_EXCEEDED': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    case 'COMPILATION_ERROR': return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    case 'RUNTIME_ERROR': return 'bg-red-500/10 text-red-400 border-red-500/20'
    case 'PENDING': return 'bg-surface-2 text-text-secondary border-border'
    case 'RUNNING': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    default: return 'bg-surface-2 text-text-secondary border-border'
  }
}

export function getStatusLabel(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACCEPTED': return 'Accepted'
    case 'WRONG_ANSWER': return 'Wrong Answer'
    case 'TIME_LIMIT_EXCEEDED': return 'Time Limit Exceeded'
    case 'COMPILATION_ERROR': return 'Compilation Error'
    case 'RUNTIME_ERROR': return 'Runtime Error'
    case 'PENDING': return 'Pending'
    case 'RUNNING': return 'Running'
    default: return status
  }
}

export function getRatingColor(rating: number): string {
  if (rating >= 2400) return 'text-red-400'
  if (rating >= 2100) return 'text-orange-400'
  if (rating >= 1900) return 'text-yellow-400'
  if (rating >= 1600) return 'text-blue-400'
  if (rating >= 1400) return 'text-green-400'
  return 'text-text-secondary'
}

export function getRatingTitle(rating: number): string {
  if (rating >= 2400) return 'Grandmaster'
  if (rating >= 2100) return 'Master'
  if (rating >= 1900) return 'Candidate Master'
  if (rating >= 1600) return 'Expert'
  if (rating >= 1400) return 'Specialist'
  return 'Newbie'
}

export function parseTags(tagsJson: string): string[] {
  try {
    return JSON.parse(tagsJson)
  } catch {
    return []
  }
}

export function parseExamples(examplesJson: string): Array<{ input: string; output: string; explanation?: string }> {
  try {
    return JSON.parse(examplesJson)
  } catch {
    return []
  }
}
