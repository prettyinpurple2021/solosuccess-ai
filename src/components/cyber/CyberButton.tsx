'use client'

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function CyberButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: CyberButtonProps) {
  const baseStyles = 'relative overflow-hidden font-sci font-bold tracking-[0.2em] uppercase transition-all duration-300 transform'
 
  const variants = {
    primary: 'bg-neon-magenta text-black shadow-[0_0_15px_rgba(255,0,110,0.4)] hover:shadow-[0_0_30px_rgba(255,0,110,0.6)] hover:-skew-x-6',
    secondary: 'border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(11,228,236,0.3)]',
    ghost: 'border border-neon-purple/40 text-white hover:bg-neon-purple/20 hover:border-neon-purple',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3 text-xs',
    lg: 'px-8 py-4 text-sm',
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        'before:content-[""] before:absolute before:inset-0 before:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] before:bg-[length:100%_4px] before:pointer-events-none before:opacity-20 hover:before:opacity-40',
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_100%] animate-shimmer pointer-events-none" />
    </button>
  )
}

