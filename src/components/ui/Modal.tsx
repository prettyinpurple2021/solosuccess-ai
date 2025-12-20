'use client'

import { ReactNode } from 'react'
import { PrimaryButton } from './Button'
import { cn } from '@/lib/utils'

interface ModalAction {
  label: string
  onClick: () => void
  variant?: 'cyan' | 'magenta' | 'lime' | 'purple' | 'orange' | 'success' | 'warning' | 'error' | 'info'
}

interface ModalProps {
  isOpen: boolean
  title?: string
  children: ReactNode
  onClose: () => void
  actions?: ModalAction[]
  variant?: 'cyan' | 'magenta' | 'lime' | 'purple' | 'orange'
  className?: string
}

export const Modal = ({ 
  isOpen,
  title,
  children,
  onClose,
  actions,
  variant = 'cyan',
  className = ''
}: ModalProps) => {
  // Theme not available during static generation - use defaults
  const theme = undefined
  
  if (!isOpen) return null
  
  const borderColorClasses = {
    cyan: 'border-neon-cyan',
    magenta: 'border-neon-magenta',
    lime: 'border-neon-lime',
    purple: 'border-neon-purple',
    orange: 'border-neon-orange',
  }
  
  const textColorClasses = {
    cyan: 'text-neon-cyan',
    magenta: 'text-neon-magenta',
    lime: 'text-neon-lime',
    purple: 'text-neon-purple',
    orange: 'text-neon-orange',
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-40 backdrop-blur-sm flex items-center justify-center" onClick={onClose}>
      <div className={cn(
        'w-full max-w-md',
        'border-2',
        borderColorClasses[variant],
        'bg-dark-card',
        theme === 'aggressive' ? 'rounded-none' : 'rounded-sm',
        'shadow-[0_0_30px_rgba(11,228,236,0.4)]',
        'z-50',
        className
      )} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        {title && (
          <div className={cn(
            'border-b-2',
            borderColorClasses[variant],
            'p-6',
            'flex justify-between items-center'
          )}>
            <h2 className={cn(textColorClasses[variant], 'font-orbitron font-bold uppercase tracking-wider')}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className={cn(textColorClasses[variant], 'hover:text-white text-xl transition-colors')}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}
        
        {/* Body */}
        <div className="p-6">
          {children}
        </div>
        
        {/* Footer */}
        {actions && actions.length > 0 && (
          <div className={cn(
            'border-t-2',
            borderColorClasses[variant],
            'p-6',
            'flex gap-4 justify-end'
          )}>
            {actions.map((action, idx) => (
              <PrimaryButton
                key={idx}
                onClick={action.onClick}
                variant={action.variant || variant}
              >
                {action.label}
              </PrimaryButton>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
