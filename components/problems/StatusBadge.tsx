import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { getStatusLabel } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const norm = status.toUpperCase()
  let variant: 'success' | 'error' | 'warning' | 'info' | 'default' = 'default'

  if (norm === 'ACCEPTED') variant = 'success'
  else if (norm === 'WRONG_ANSWER' || norm === 'RUNTIME_ERROR') variant = 'error'
  else if (norm === 'TIME_LIMIT_EXCEEDED' || norm === 'COMPILATION_ERROR') variant = 'warning'
  else if (norm === 'RUNNING') variant = 'info'

  return (
    <Badge variant={variant} className={className}>
      {getStatusLabel(status)}
    </Badge>
  )
}
