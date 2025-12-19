'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TextProps {
  size?: 'xs' | 'sm' | 'base' | 'lg'
  mono?: boolean
  uppercase?: boolean
  color?: 'white' | 'secondary' | 'tertiary' | 'cyan' | 'magenta' | 'lime' | 'purple' | 'success' | 'error' | 'warning' | 'info'
  children: ReactNode
  className?: string
  as?: 'p' | 'span' | 'div'
}

export const Text = ({ 
  size = 'base',
  mono = true,
  uppercase = false,
  color = 'white',
  children,
  className = '',
  as: Component = 'p',
}: TextProps) => {
  const sizeClasses = {
    xs: 'text-xs', 
    sm: 'text-sm', 
    base: 'text-base', 
    lg: 'text-lg',
  }
  
  const colorClasses = {
    white: 'text-white',
    secondary: 'text-gray-300',
    tertiary: 'text-gray-500',
    cyan: 'text-neon-cyan',
    magenta: 'text-neon-magenta',
    lime: 'text-neon-lime',
    purple: 'text-neon-purple',
    success: 'text-neon-lime',
    error: 'text-neon-magenta',
    warning: 'text-neon-orange',
    info: 'text-neon-cyan',
  }
  
  return (
    <Component className={cn(
      sizeClasses[size],
      mono && 'font-mono',
      uppercase && 'uppercase tracking-wide',
      colorClasses[color],
      className
    )}>
      {children}
    </Component>
  )
}
