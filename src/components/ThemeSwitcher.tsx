'use client'

import { useTheme } from 'next-themes'
import { themeModes } from '@/lib/theme/modes'
import { useEffect, useState } from 'react'

export function ThemeSwitcher() {
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

  if (!mounted || !setTheme) return <div className="w-24 h-10 bg-dark-hover rounded-sm animate-pulse" />

  return (
    <div className="flex gap-2">
      {Object.entries(themeModes).map(([key, mode]) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={`
            px-4 py-2 text-sm font-mono uppercase tracking-wider
            border-2 transition-all duration-300
            ${theme === key
              ? 'border-cyan-400 bg-cyan-400 bg-opacity-10 text-cyan-400 shadow-[0_0_20px_rgba(11,228,236,0.4)]'
              : 'border-gray-600 text-gray-400 hover:border-cyan-400'
            }
          `}
        >
          {mode.name}
        </button>
      ))}
    </div>
  )
}
