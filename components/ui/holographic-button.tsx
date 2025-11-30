"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface HolographicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline"
  size?: "sm" | "md" | "lg"
}

/**
 * Lightweight holographic-styled button used by workflow prototypes.
 */
export const HolographicButton = React.forwardRef<HTMLButtonElement, HolographicButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const variantClass = {
      default: "from-purple-500/80 via-fuchsia-500/50 to-sky-500/70 text-white shadow-lg",
      success: "from-emerald-500 via-teal-500 to-green-500 text-white shadow-lg",
      warning: "from-amber-500 via-orange-500 to-yellow-500 text-slate-900 shadow-lg",
      danger: "from-rose-500 via-pink-500 to-red-500 text-white shadow-lg",
      outline: "border border-purple-400/60 bg-transparent text-purple-100 hover:bg-purple-500/10",
    }[variant]

    const sizeClass = {
      sm: "px-4 py-1.5 text-xs",
      md: "px-5 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    }[size]

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300",
          "bg-gradient-to-br hover:scale-[1.02] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "ring-offset-slate-950/80 dark:ring-offset-slate-900",
          variantClass,
          sizeClass,
          className,
        )}
        {...props}
      >
        <span className="pointer-events-none mix-blend-screen">{children}</span>
      </button>
    )
  },
)

HolographicButton.displayName = "HolographicButton"
