export const designTokens = {
  // Spacing
  space: {
    xs: '0.25rem',  // 4px (tight)
    sm: '0.5rem',   // 8px (compact)
    md: '1rem',     // 16px (default)
    lg: '1.5rem',   // 24px (loose)
    xl: '2rem',     // 32px (spacious)
    '2xl': '3rem',  // 48px (very spacious)
    '3xl': '4rem',  // 64px (extreme)
  },
  
  // Border Radius
  radius: {
    none: '0px',        // Square (aggressive mode)
    sm: '4px',          // Subtle (balanced mode)
    md: '8px',          // Medium
    lg: '12px',         // Large
    full: '9999px',     // Fully rounded (pills, circles)
  },
  
  // Font Sizes
  fontSize: {
    '2xs': '0.625rem',  // 10px
    'xs': '0.75rem',    // 12px
    'sm': '0.875rem',   // 14px
    'base': '1rem',     // 16px
    'lg': '1.125rem',   // 18px
    'xl': '1.25rem',    // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '2rem',      // 32px
    '4xl': '2.5rem',    // 40px
    '5xl': '3rem',      // 48px
  },
  
  // Z-Index Stack
  zIndex: {
    hide: '-10',
    auto: '0',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    backdrop: '1040',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
  },
  
  // Transition/Animation
  transition: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    custom: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
}

export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
  32: '8rem',    // 128px
}

export const breakpoints = {
  xs: '320px',   // Mobile (small)
  sm: '640px',   // Mobile (large)
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop (small)
  xl: '1280px',  // Desktop (large)
  '2xl': '1536px', // Ultra-wide
}
