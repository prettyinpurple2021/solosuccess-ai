'use client'

import { useTheme as useNextTheme } from 'next-themes'

/**
 * Safe wrapper for useTheme that handles missing context during static generation
 * Returns default values when React context isn't available
 * 
 * Note: useTheme from next-themes should handle missing context, but if React is null
 * during static generation, we need to provide defaults
 */
export function useSafeTheme() {
  // useTheme must be called unconditionally (React rules of hooks)
  // If React is null during static generation, this will throw
  // We rely on next-themes to handle missing context gracefully
  try {
    const themeContext = useNextTheme()
    return {
      theme: themeContext?.theme,
      isBalanced: themeContext?.theme === 'balanced'
    }
  } catch {
    // During static generation when React is null, return defaults
    return { theme: undefined, isBalanced: false }
  }
}
