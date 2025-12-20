"use client"

import { Moon, Sun} from "lucide-react"
import { useTheme} from "next-themes"
import { Button} from "@/components/ui/button"
import { useEffect, useState} from "react"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  
  // useTheme must be called unconditionally (React rules of hooks)
  // During static generation, this may fail, so we provide defaults
  let theme: string | undefined = undefined
  let setTheme: ((theme: string) => void) | undefined = undefined
  
  try {
    const themeContext = useTheme()
    theme = themeContext?.theme
    setTheme = themeContext?.setTheme
  } catch {
    // During static generation when React is null, use defaults
    theme = undefined
    setTheme = undefined
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !setTheme) {
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
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 p-0 hover:bg-pink-100 dark:hover:bg-blue-800/50 transition-colors"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-yellow-500 transition-all" />
      ) : (
        <Moon className="h-4 w-4 text-blue-600 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
