/**
 * SoloSuccess AI - Aggressive Cyberpunk Design System v4
 * Centralized design tokens for neon glows, technical borders, and futuristic animations.
 */

export const CYBER_COLORS = {
  background: '#020204',
  surface: '#0a0514',
  primary: '#ff006e', // Neon Magenta
  secondary: '#0be4ec', // Neon Cyan
  accent: '#b300ff', // Neon Purple
  success: '#39ff14', // Neon Lime
  warning: '#ff6600', // Neon Orange
  error: '#ff1414', // High Contrast Red
  dim: 'rgba(11, 228, 236, 0.1)',
}

export const CYBER_GLOWS = {
  cyan: '0 0 10px rgba(11, 228, 236, 0.5), 0 0 20px rgba(11, 228, 236, 0.3)',
  magenta: '0 0 10px rgba(255, 0, 110, 0.5), 0 0 20px rgba(255, 0, 110, 0.3)',
  purple: '0 0 10px rgba(179, 0, 255, 0.5), 0 0 20px rgba(179, 0, 255, 0.3)',
  text: '0 0 5px currentColor',
}

export const CYBER_BORDERS = {
  thin: '1px solid rgba(11, 228, 236, 0.3)',
  thick: '2px solid rgba(11, 228, 236, 0.5)',
  interactive: '1px solid rgba(255, 0, 110, 0.5)',
}

export const CYBER_ANIMATIONS = {
  glitch: 'glitch 0.3s cubic-bezier(.25,.46,.45,.94) both infinite',
  pulse: 'pulse-neon 2s ease-in-out infinite',
  scanline: 'scanline 10s linear infinite',
}

export const CYBER_FONTS = {
  display: 'var(--font-orbitron)',
  tech: 'var(--font-jetbrains-mono)',
  body: 'var(--font-inter)',
}
