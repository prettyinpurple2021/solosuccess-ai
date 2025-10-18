"use client"

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface TacticalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  withShine?: boolean
  withPulse?: boolean
}

const TacticalButton = forwardRef<HTMLButtonElement, TacticalButtonProps>(
  ({ className, variant = 'primary', size = 'md', withShine = true, withPulse = false, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-heading font-bold text-uppercase tracking-wider rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden'
    
    const variantClasses = {
      primary: 'bg-gradient-to-r from-[#FF71B5] to-[#FFB3D9] text-white border-2 border-white/20 shadow-[0_4px_16px_rgba(255,113,181,0.4)] hover:shadow-[0_8px_24px_rgba(255,113,181,0.6)] hover:-translate-y-0.5',
      secondary: 'bg-gradient-to-r from-[#5D5C61] to-[#454547] text-[#FAFAFA] border-2 border-[#FF71B5]/30 shadow-[0_4px_16px_rgba(93,92,97,0.4)] hover:shadow-[0_8px_24px_rgba(255,113,181,0.4)] hover:-translate-y-0.5',
      ghost: 'bg-transparent text-[#FF71B5] border-2 border-[#FF71B5]/50 hover:bg-[#FF71B5]/10 hover:border-[#FF71B5]',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-white/20 shadow-[0_4px_16px_rgba(239,68,68,0.4)] hover:shadow-[0_8px_24px_rgba(239,68,68,0.6)] hover:-translate-y-0.5'
    }
    
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl'
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          withShine && 'glass-shine',
          withPulse && 'pulse-tactical',
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
        {withShine && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        )}
      </motion.button>
    )
  }
)

TacticalButton.displayName = 'TacticalButton'

export { TacticalButton }

