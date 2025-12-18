"use client"

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CamoBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  opacity?: number
  withGrid?: boolean
}

export function CamoBackground({ opacity = 1, withGrid = false, className, children, ...props }: CamoBackgroundProps) {
  return (
    <div className={cn('relative', className)} {...props}>
      <div
        className={cn('absolute inset-0 camo-background', withGrid && 'tactical-grid-bg')}
        style={{ opacity }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

