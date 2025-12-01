"use client"

import Link from 'next/link'
import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { logError } from '@/lib/logger'

interface TacticalLinkProps {
  href: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  withShine?: boolean
  withPulse?: boolean
  children?: ReactNode
  className?: string
  target?: string
  rel?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export function TacticalLink({
  href,
  variant = 'primary',
  size = 'md',
  withShine = true,
  withPulse = false,
  children,
  className,
  target,
  rel,
  onClick
}: TacticalLinkProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-heading font-bold text-uppercase tracking-wider rounded-xl transition-all duration-300 relative overflow-hidden no-underline hover:scale-105 active:scale-95'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#FF71B5] to-[#FFB3D9] text-white border-2 border-white/20 shadow-[0_4px_16px_rgba(255,113,181,0.4)] hover:shadow-[0_8px_24px_rgba(255,113,181,0.6)] hover:-translate-y-0.5',
    secondary: 'bg-gradient-to-r from-[#5D5C61] to-[#454547] text-[#FAFAFA] border-2 border-[#FF71B5]/30 shadow-[0_4px_16px_rgba(93,92,97,0.4)] hover:shadow-[0_8px_24px_rgba(255,113,181,0.4)] hover:-translate-y-0.5',
    ghost: 'bg-transparent text-[#FF71B5] border-2 border-[#FF71B5]/50 hover:bg-[#FF71B5]/10 hover:border-[#FF71B5]',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-white/20 shadow-[0_4px_16px_rgba(239,68,68,0.4)] hover:shadow-[0_8px_24px_rgba(239,68,68,0.6)] hover:-translate-y-0.5',
    outline: 'bg-transparent text-white border-2 border-white/60 hover:border-white hover:bg-white/10'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      if (onClick) {
        onClick(e)
      }
      // Allow default navigation behavior
    } catch (error) {
      logError('Error in TacticalLink click handler:', error)
      // Don't prevent default navigation even if onClick handler fails
    }
  }

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      onClick={handleClick}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        withShine && 'glass-shine',
        withPulse && 'pulse-tactical',
        className
      )}
      prefetch={true}
    >
      {children}
      {withShine && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      )}
    </Link>
  )
}

