'use client'

import { useTheme } from 'next-themes'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  color?: 'white' | 'cyan' | 'magenta' | 'lime' | 'purple'
  glitch?: boolean
  children: ReactNode
  className?: string
}

export const Heading = ({ 
  level = 1,
  color = 'white',
  glitch = true,
  children,
  className = '',
}: HeadingProps) => {
  const { theme } = useTheme()
  
  const headingTags = {
    1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6',
  }
  
  const colorClasses = {
    white: 'text-white',
    cyan: 'text-neon-cyan',
    magenta: 'text-neon-magenta',
    lime: 'text-neon-lime',
    purple: 'text-neon-purple',
  }
  
  const Tag = headingTags[level] as keyof JSX.IntrinsicElements
  
  return (
    <Tag 
      className={cn(
        'font-orbitron font-bold uppercase tracking-wider',
        colorClasses[color],
        glitch && 'glitch-hover',
        'transition-all duration-300',
        className
      )}
      data-text={glitch ? String(children) : undefined}
    >
      {children}
    </Tag>
  )
}
