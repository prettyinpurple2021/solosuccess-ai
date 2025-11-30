"use client"

import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatsBadgeProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode
  label?: string
  value?: string | number
  variant?: 'default' | 'warning' | 'success' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
}

export function StatsBadge({ icon, label, value, variant = 'default', size = 'md', className, children, ...props }: StatsBadgeProps) {
  const variantClasses = {
    default: 'bg-military-hot-pink/12 border-military-hot-pink/30',
    warning: 'bg-yellow-500/12 border-yellow-500/30 text-yellow-200',
    success: 'bg-green-500/12 border-green-500/30 text-green-200',
    danger: 'bg-red-500/12 border-red-500/30 text-red-200',
    info: 'bg-blue-500/12 border-blue-500/30 text-blue-200'
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  // If children are provided, use them instead of label/value structure
  if (children) {
    return (
      <div className={cn('stats-badge', variantClasses[variant], sizeClasses[size], className)} {...props}>
        {children}
      </div>
    )
  }

  return (
    <div className={cn('stats-badge', variantClasses[variant], sizeClasses[size], className)} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {label && <span className="text-xs opacity-80">{label}:</span>}
      {value !== undefined && <span className="font-bold">{value}</span>}
    </div>
  )
}

