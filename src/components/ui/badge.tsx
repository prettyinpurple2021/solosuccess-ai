'use client'

import { useTheme } from 'next-themes'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'cyan' | 'magenta' | 'lime' | 'purple' | 'orange'
  size?: 'sm' | 'md' | 'lg'
  glitch?: boolean
  className?: string
}

export const Badge = ({ 
  children,
  variant = 'cyan',
  size = 'md',
  glitch = false,
  className = ''
}: BadgeProps) => {
  const { theme } = useTheme()
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }
  
  const variants = {
    cyan: 'border-neon-cyan text-neon-cyan bg-neon-cyan/5',
    magenta: 'border-neon-magenta text-neon-magenta bg-neon-magenta/5',
    lime: 'border-neon-lime text-neon-lime bg-neon-lime/5',
    purple: 'border-neon-purple text-neon-purple bg-neon-purple/5',
    orange: 'border-neon-orange text-neon-orange bg-neon-orange/5',
  }
  
  return (
    <span className={cn(
      'border-2',
      variants[variant],
      theme === 'aggressive' ? 'rounded-none' : 'rounded-sm',
      'font-bold uppercase tracking-wide',
      'inline-block',
      sizeClasses[size],
      glitch && 'glitch-hover',
      'transition-all duration-300',
      className
    )}
    data-text={glitch ? String(children) : undefined}
    >
      {children}
    </span>
  )
}
