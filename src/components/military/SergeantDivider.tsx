"use client"

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SergeantDividerProps extends HTMLAttributes<HTMLDivElement> {
  opacity?: number
}

export function SergeantDivider({ opacity = 0.6, className, ...props }: SergeantDividerProps) {
  return (
    <div
      className={cn('sergeant-divider', className)}
      style={{ opacity }}
      {...props}
    />
  )
}

