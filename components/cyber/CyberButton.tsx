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
  const baseStyles = 'relative overflow-hidden font-sci font-bold tracking-widest transition-all duration-300'
  
  const variants = {
    primary: 'bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan hover:text-white group',
    secondary: 'border border-gray-600 hover:border-cyber-purple text-gray-300 hover:text-cyber-purple',
    ghost: 'bg-transparent border border-cyber-purple/50 text-cyber-purple hover:text-white',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
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
      style={
        variant === 'primary'
          ? {
              position: 'relative',
            }
          : undefined
      }
    >
      {variant === 'primary' && (
        <div className="absolute inset-0 w-0 bg-cyber-cyan transition-all duration-[250ms] ease-out group-hover:w-full opacity-20" />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  )
}

