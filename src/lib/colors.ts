export const colors = {
  background: {
    primary: '#0a0e27',    // Main dark background
    secondary: '#0f1535',  // Card backgrounds
    tertiary: '#151d3a',   // Hover states
  },
  
  neon: {
    cyan: '#0be4ec',       // Primary accent (electric blue)
    magenta: '#ff006e',    // Secondary accent (hot pink)
    lime: '#39ff14',       // Tertiary accent (neon green)
    purple: '#b300ff',     // Quaternary accent (electric purple)
    orange: '#ff6600',     // Highlight accent (neon orange)
  },
  
  text: {
    primary: '#ffffff',    // Main text
    secondary: '#0be4ec',  // Secondary text (cyan)
    tertiary: '#888888',   // Disabled/hint text
    glow: '#0be4ec',       // Glowing text accent
  },
  
  border: {
    neon: '#0be4ec',       // Neon cyan borders
    magenta: '#ff006e',    // Magenta glowing borders
    lime: '#39ff14',       // Lime glowing borders
    purple: '#b300ff',     // Purple glowing borders
    subtle: '#1a2347',     // Subtle dark borders
  },
  
  semantic: {
    success: '#39ff14',    // Lime for success (green)
    warning: '#ff6600',    // Orange for warning
    error: '#ff006e',      // Magenta for error (red)
    info: '#0be4ec',       // Cyan for info (blue)
  },
}

export const glows = {
  // Balanced Mode (subtle, production-safe)
  balanced: {
    cyan: '0 0 10px rgba(11, 228, 236, 0.3), 0 0 15px rgba(11, 228, 236, 0.15)',
    magenta: '0 0 10px rgba(255, 0, 110, 0.3), 0 0 15px rgba(255, 0, 110, 0.15)',
    lime: '0 0 10px rgba(57, 255, 20, 0.3), 0 0 15px rgba(57, 255, 20, 0.15)',
    purple: '0 0 10px rgba(179, 0, 255, 0.3), 0 0 15px rgba(179, 0, 255, 0.15)',
    orange: '0 0 10px rgba(255, 102, 0, 0.3), 0 0 15px rgba(255, 102, 0, 0.15)',
  },
  // Aggressive Mode (intense, eye-catching)
  aggressive: {
    cyan: '0 0 10px rgba(11, 228, 236, 0.5), 0 0 20px rgba(11, 228, 236, 0.3)',
    magenta: '0 0 10px rgba(255, 0, 110, 0.5), 0 0 20px rgba(255, 0, 110, 0.3)',
    lime: '0 0 10px rgba(57, 255, 20, 0.5), 0 0 20px rgba(57, 255, 20, 0.3)',
    purple: '0 0 10px rgba(179, 0, 255, 0.5), 0 0 20px rgba(179, 0, 255, 0.3)',
    orange: '0 0 10px rgba(255, 102, 0, 0.5), 0 0 20px rgba(255, 102, 0, 0.3)',
  },
}
