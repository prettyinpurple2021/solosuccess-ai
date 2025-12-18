'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'

interface SoloSuccessLogoProps {
  className?: string
  size?: number
  animated?: boolean
  variant?: 'default' | 'footer'
  priority?: boolean
}

/**
 * Renders the provided SoloSuccess neon SS logo image with an optional animated ring.
 * Uses the high-fidelity PNG in /public for now; easy to swap to SVG later if desired.
 */
export function SoloSuccessLogo({
  className,
  size = 56,
  animated = true,
  variant = 'default',
  priority = false,
}: SoloSuccessLogoProps) {
  const ringClass = useMemo(
    () =>
      variant === 'default'
        ? 'before:content-[""] before:absolute before:inset-[-6%] before:rounded-full before:border before:border-cyber-cyan/40 before:shadow-[0_0_20px_rgba(0,240,255,0.35)] before:blur-[0.3px]'
        : '',
    [variant]
  )

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        ringClass,
        animated && variant === 'default' && 'animate-spin-slow',
        className
      )}
      style={{ width: size, height: size }}
      aria-label="SoloSuccess AI logo"
    >
      <div className="absolute inset-0 rounded-full bg-cyber-black/40 blur-[1px]" aria-hidden />
      <div className="relative w-full h-full">
        <Image
          src="/SoloSuccessLogo.png"
          alt="SoloSuccess AI logo"
          width={size}
          height={size}
          priority={priority}
          className={cn(
            'object-contain drop-shadow-[0_0_12px_rgba(0,240,255,0.35)]',
            variant === 'footer' && 'drop-shadow-[0_0_12px_rgba(189,0,255,0.35)]'
          )}
        />
      </div>
    </div>
  )
}

