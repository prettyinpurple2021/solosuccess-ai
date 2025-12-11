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
  const baseStyles = 'relative overflow-hidden font-sci font-bold tracking-[0.2em] uppercase transition-all duration-300'
 
  const variants = {
    primary: 'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-black shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:shadow-[0_0_30px_rgba(255,0,183,0.25)]',
    secondary: 'border border-cyber-cyan/60 text-cyber-cyan hover:bg-cyber-cyan/15 hover:text-white',
    ghost: 'border border-cyber-purple/60 text-white hover:bg-cyber-purple/15',
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
        variant === 'primary' && 'hover:before:w-full',
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}

