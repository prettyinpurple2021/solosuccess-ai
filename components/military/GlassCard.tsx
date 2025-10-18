"use client"

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'tactical'
  withChevron?: boolean
  withShine?: boolean
  interactive?: boolean
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', withChevron = false, withShine = false, interactive = false, children, ...props }, ref) => {
    const variantClasses = {
      default: 'glass-card',
      strong: 'glass-panel-strong',
      tactical: 'glass-overlay-tactical'
    }

    const CardComponent = interactive ? motion.div : 'div'
    const motionProps = interactive ? {
      whileHover: { scale: 1.02, y: -2 },
      transition: { duration: 0.2 }
    } : {}

    return (
      <CardComponent
        ref={ref}
        className={cn(
          'relative',
          variantClasses[variant],
          withChevron && 'chevron-accent',
          withShine && 'glass-shine',
          interactive && 'cursor-pointer',
          className
        )}
        {...motionProps}
        {...props}
      >
        {children}
      </CardComponent>
    )
  }
)

GlassCard.displayName = 'GlassCard'

export { GlassCard }

