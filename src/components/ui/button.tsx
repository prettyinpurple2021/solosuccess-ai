'use client'

import { useTheme } from 'next-themes'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PrimaryButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'cyan' | 'magenta' | 'lime' | 'purple' | 'orange' | 'success' | 'warning' | 'error' | 'info'
  className?: string
}

export const PrimaryButton = ({ 
  children, 
  onClick, 
  disabled = false,
  size = 'md',
  variant = 'cyan',
  className = '',
  ...props
}: PrimaryButtonProps) => {
  const { theme } = useTheme()
  const isBalanced = theme === 'balanced'
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  const semanticMap = {
    success: 'lime',
    warning: 'orange',
    error: 'magenta',
    info: 'cyan',
  } as const
  
  const resolvedVariant = semanticMap[variant as keyof typeof semanticMap] || variant
  
  const variants = {
    cyan: `border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:bg-opacity-10 ${
      isBalanced ? 'hover:shadow-[0_0_15px_rgba(11,228,236,0.3)]' : 'hover:shadow-[0_0_20px_rgba(11,228,236,0.5)]'
    }`,
    magenta: `border-2 border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:bg-opacity-10 ${
      isBalanced ? 'hover:shadow-[0_0_15px_rgba(255,0,110,0.3)]' : 'hover:shadow-[0_0_20px_rgba(255,0,110,0.5)]'
    }`,
    lime: `border-2 border-neon-lime text-neon-lime hover:bg-neon-lime hover:bg-opacity-10 ${
      isBalanced ? 'hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]'
    }`,
    purple: `border-2 border-neon-purple text-neon-purple hover:bg-neon-purple hover:bg-opacity-10 ${
      isBalanced ? 'hover:shadow-[0_0_15px_rgba(179,0,255,0.3)]' : 'hover:shadow-[0_0_20px_rgba(179,0,255,0.5)]'
    }`,
    orange: `border-2 border-neon-orange text-neon-orange hover:bg-neon-orange hover:bg-opacity-10 ${
      isBalanced ? 'hover:shadow-[0_0_15px_rgba(255,102,0,0.3)]' : 'hover:shadow-[0_0_20px_rgba(255,102,0,0.5)]'
    }`,
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        sizes[size],
        variants[resolvedVariant as keyof typeof variants],
        'bg-transparent',
        'font-bold uppercase tracking-wider',
        theme === 'aggressive' ? 'rounded-none' : 'rounded-sm',
        'transition-all duration-300 ease-out',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg',
        'hover:scale-105',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
