"use client"
import dynamic from 'next/dynamic'
import type { ThemeProviderProps } from "next-themes"
import { useEffect } from "react"

// Dynamically import ThemeProvider to prevent build-time context creation
const NextThemesProvider = dynamic(
  () => import("next-themes").then(mod => mod.ThemeProvider),
  { ssr: false }
)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useEffect(() => {
    // Add holographic theme support to the document
    const updateThemeColors = () => {
      const root = document.documentElement;
      const isDark = root.classList.contains('dark');
      
      if (isDark) {
        // Dark mode holographic colors
        root.style.setProperty('--holo-bg', 'rgba(0, 0, 0, 0.8)');
        root.style.setProperty('--holo-border', 'rgba(182, 33, 255, 0.3)');
        root.style.setProperty('--holo-glow', 'rgba(182, 33, 255, 0.5)');
        root.style.setProperty('--holo-text', 'rgba(255, 255, 255, 0.9)');
      } else {
        // Light mode holographic colors
        root.style.setProperty('--holo-bg', 'rgba(255, 255, 255, 0.1)');
        root.style.setProperty('--holo-border', 'rgba(182, 33, 255, 0.2)');
        root.style.setProperty('--holo-glow', 'rgba(182, 33, 255, 0.3)');
        root.style.setProperty('--holo-text', 'rgba(0, 0, 0, 0.9)');
      }
    };

    // Initial setup
    updateThemeColors();

    // Listen for theme changes
    const observer = new MutationObserver(updateThemeColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <NextThemesProvider 
      {...props}
      themes={['light', 'dark', 'system']}
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  )
}
