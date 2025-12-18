'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface GlitchTextProps {
  children: ReactNode
  className?: string
  dataText?: string
}

export function GlitchText({ children, className, dataText }: GlitchTextProps) {
  const text = dataText || (typeof children === 'string' ? children : '')
  
  return (
    <span
      className={cn('relative', className)}
      data-text={text}
    >
      {children}
    </span>
  )
}

