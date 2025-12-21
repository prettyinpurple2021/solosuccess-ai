"use client"

import { Moon, Sun} from "lucide-react"
import { useTheme} from "next-themes"
import { Button} from "@/components/ui/button"
import { useEffect, useState} from "react"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  // useTheme must be called unconditionally (React rules of hooks)
  // With ThemeProvider using dynamic import (ssr: false), this is safe during static generation
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
        <div className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "balanced" ? "aggressive" : "balanced")}
      className="w-9 h-9 p-0 hover:bg-cyan-400/10 transition-colors"
    >
      {theme === "aggressive" ? (
        <Sun className="h-4 w-4 text-cyan-400 transition-all" />
      ) : (
        <Moon className="h-4 w-4 text-cyan-300 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
