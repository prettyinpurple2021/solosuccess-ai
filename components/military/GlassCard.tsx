"use client"

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { motion, type HTMLMotionProps } from 'framer-motion'

interface GlassCardProps extends HTMLMotionProps<'div'> {
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

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative',
          variantClasses[variant],
          withChevron && 'chevron-accent',
          withShine && 'glass-shine',
          interactive && 'cursor-pointer',
          className
        )}
        whileHover={interactive ? { scale: 1.02, y: -2 } : undefined}
        transition={interactive ? { duration: 0.2 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

GlassCard.displayName = 'GlassCard'

export { GlassCard }

