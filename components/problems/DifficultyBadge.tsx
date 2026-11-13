import React from 'react'
import { Badge } from '@/components/ui/Badge'

interface DifficultyBadgeProps {
  difficulty: string
  className?: string
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const norm = difficulty.toUpperCase()
  const variant = norm === 'EASY' ? 'easy' : norm === 'MEDIUM' ? 'medium' : norm === 'HARD' ? 'hard' : 'default'
  const label = norm.charAt(0) + norm.slice(1).toLowerCase()

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  )
}
