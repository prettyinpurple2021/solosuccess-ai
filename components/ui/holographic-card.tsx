"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface HolographicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  emphasis?: "default" | "glow" | "subtle"
}

/**
 * Provides a shimmering container used across workflow previews.
 */
export const HolographicCard = React.forwardRef<HTMLDivElement, HolographicCardProps>(
  ({ className, emphasis = "default", children, ...props }, ref) => {
    const emphasisStyle = {
      default: "backdrop-blur border border-white/10 bg-gradient-to-br from-white/10 via-purple-500/5 to-indigo-500/10",
      glow: "backdrop-blur-lg border border-purple-500/40 bg-gradient-to-br from-purple-500/20 via-fuchsia-500/10 to-sky-500/20 shadow-[0_0_30px_rgba(168,85,247,0.35)]",
      subtle: "border border-white/5 bg-white/5 dark:bg-slate-900/40",
    }[emphasis]

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-3xl p-6 transition-all duration-300",
          "before:absolute before:inset-0 before:-translate-y-full before:bg-gradient-to-b before:from-white/30 before:to-transparent before:opacity-0 before:transition-all before:duration-500",
          "hover:before:translate-y-0 hover:before:opacity-100",
          emphasisStyle,
          className,
        )}
        {...props}
      >
        <div className="relative z-10">{children}</div>
      </div>
    )
  },
)

HolographicCard.displayName = "HolographicCard"
