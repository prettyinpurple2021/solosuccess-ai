"use client"

import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatsBadgeProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode
  label: string
  value: string | number
}

export function StatsBadge({ icon, label, value, className, ...props }: StatsBadgeProps) {
  return (
    <div className={cn('stats-badge', className)} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="text-xs opacity-80">{label}:</span>
      <span className="font-bold">{value}</span>
    </div>
  )
}

