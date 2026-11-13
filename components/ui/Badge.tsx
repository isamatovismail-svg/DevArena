import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  variant?: 'default' | 'easy' | 'medium' | 'hard' | 'success' | 'warning' | 'error' | 'info' | 'purple'
  className?: string
}

const variants = {
  default: 'bg-surface-2 text-text-secondary border-border',
  easy: 'bg-green-500/10 text-green-400 border-green-500/25',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25',
  hard: 'bg-red-500/10 text-red-400 border-red-500/25',
  success: 'bg-green-500/10 text-green-400 border-green-500/25',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25',
  error: 'bg-red-500/10 text-red-400 border-red-500/25',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
  purple: 'bg-accent-500/10 text-accent-300 border-accent-500/25',
}

export function Badge({ children, variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
