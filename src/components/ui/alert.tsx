'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  description?: string
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export const Alert = ({ 
  variant = 'info',
  title,
  description,
  dismissible = true,
  onDismiss,
  className = ''
}: AlertProps) => {
  const [isVisible, setIsVisible] = React.useState(true)
  const { theme } = useTheme()
  const isBalanced = theme === 'balanced'
  
  const variants = {
    success: {
      border: 'border-neon-lime',
      shadow: isBalanced 
        ? 'shadow-[0_0_15px_rgba(57,255,20,0.2)]' 
        : 'shadow-[0_0_20px_rgba(57,255,20,0.3)]',
      title: 'text-neon-lime',
      icon: '✓',
      bg: 'bg-neon-lime/5',
    },
    error: {
      border: 'border-neon-magenta',
      shadow: isBalanced 
        ? 'shadow-[0_0_15px_rgba(255,0,110,0.2)]' 
        : 'shadow-[0_0_20px_rgba(255,0,110,0.3)]',
      title: 'text-neon-magenta',
      icon: '✕',
      bg: 'bg-neon-magenta/5',
    },
    warning: {
      border: 'border-neon-orange',
      shadow: isBalanced 
        ? 'shadow-[0_0_15px_rgba(255,102,0,0.2)]' 
        : 'shadow-[0_0_20px_rgba(255,102,0,0.3)]',
      title: 'text-neon-orange',
      icon: '!',
      bg: 'bg-neon-orange/5',
    },
    info: {
      border: 'border-neon-cyan',
      shadow: isBalanced 
        ? 'shadow-[0_0_15px_rgba(11,228,236,0.2)]' 
        : 'shadow-[0_0_20px_rgba(11,228,236,0.3)]',
      title: 'text-neon-cyan',
      icon: 'ℹ',
      bg: 'bg-neon-cyan/5',
    },
  }
  
  const config = variants[variant]
  
  if (!isVisible) return null
  
  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }
  
  return (
    <div className={cn(
      'border-2',
      config.border,
      config.bg,
      'bg-dark-card',
      theme === 'aggressive' ? 'rounded-none' : 'rounded-sm',
      'p-4',
      config.shadow,
      'flex gap-4 items-start',
      'transition-all duration-300',
      className
    )}>
      <div className={cn('text-xl font-bold', config.title, 'flex-shrink-0')}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        {title && <h4 className={cn('font-bold', config.title, 'mb-1')}>{title}</h4>}
        {description && <p className="text-gray-300 text-sm font-mono">{description}</p>}
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      )}
    </div>
  )
}
