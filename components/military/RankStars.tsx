"use client"

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface RankStarsProps extends HTMLAttributes<HTMLDivElement> {
  count: number
  maxStars?: number
  size?: 'sm' | 'md' | 'lg'
}

export function RankStars({ count, maxStars = 5, size = 'md', className, ...props }: RankStarsProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn('flex items-center gap-1', className)} {...props}>
      {Array.from({ length: maxStars }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'rank-star',
            sizeClasses[size],
            index < count ? 'opacity-100' : 'opacity-30'
          )}
        />
      ))}
    </div>
  )
}

