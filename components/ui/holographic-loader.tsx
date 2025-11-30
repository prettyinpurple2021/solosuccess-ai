"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface HolographicLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  text?: string
}

const SIZE_MAP: Record<NonNullable<HolographicLoaderProps["size"]>, string> = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
}

/**
 * Animated loader that matches the holographic UI theme used in workflow pages.
 */
export function HolographicLoader({ className, size = "md", text, ...props }: HolographicLoaderProps) {
  return (
    <div className="flex flex-col items-center gap-2" {...props}>
      <div
        className={cn(
          "relative inline-flex items-center justify-center",
          SIZE_MAP[size],
          className,
        )}
        aria-live="polite"
        role="status"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/40 via-fuchsia-500/20 to-sky-500/40 blur-md" />
        <span className="absolute inset-[12%] rounded-full border border-white/40" />
        <span className="absolute h-2/3 w-2/3 animate-spin rounded-full border-b-2 border-white/70" />
        <span className="sr-only">Loading…</span>
      </div>
      {text ? <span className="text-xs text-gray-300">{text}</span> : null}
    </div>
  )
}
