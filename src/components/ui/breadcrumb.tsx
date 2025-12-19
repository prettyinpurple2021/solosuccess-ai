'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export const Breadcrumb = ({ items, className = '' }: BreadcrumbProps) => {
  return (
    <nav className={cn('flex items-center gap-4', className)} aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-neon-cyan font-bold">/</span>}
          {item.href ? (
            <a href={item.href} className="text-neon-cyan hover:text-neon-magenta font-mono uppercase text-sm transition-colors">
              {item.label}
            </a>
          ) : (
            <span className="text-gray-300 font-mono uppercase text-sm">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
