import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2 className={cn('animate-spin text-accent-400 shrink-0', sizes[size], className)} />
  )
}

export function PageLoader({ text = 'Loading DevArena...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[350px] w-full">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-xs text-text-secondary tracking-wide uppercase">{text}</p>
      </div>
    </div>
  )
}
