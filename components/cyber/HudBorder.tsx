'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface HudBorderProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'hover'
}

export function HudBorder({ children, className, variant = 'default' }: HudBorderProps) {
  return (
    <div
      className={cn(
        'relative',
        'bg-[rgba(10,5,20,0.6)]',
        'backdrop-blur-[5px]',
        'border border-cyber-cyan/20',
        'transition-all duration-300',
        variant === 'hover' && 'hover:border-cyber-cyan/80 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] hover:-translate-y-0.5',
        'clip-path-hud',
        className
      )}
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',
      }}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyber-cyan" />
      <div 
        className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyber-cyan"
        style={{ transform: 'translate(-5px, -5px)' }}
      />
      {children}
    </div>
  )
}

