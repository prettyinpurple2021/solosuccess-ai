"use client"

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface TacticalGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: number
  gap?: number
}

export function TacticalGrid({ columns = 12, gap = 24, className, children, ...props }: TacticalGridProps) {
  return (
    <div
      className={cn('tactical-grid', className)}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        padding: '0 24px',
        maxWidth: '1440px',
        margin: '0 auto'
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function TacticalGridItem({ span = 12, className, children, ...props }: { span?: number } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(className)}
      style={{ gridColumn: `span ${span}` }}
      {...props}
    >
      {children}
    </div>
  )
}

