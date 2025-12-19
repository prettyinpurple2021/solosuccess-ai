import { Orbitron, JetBrains_Mono } from 'next/font/google'

export const orbitronFont = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
  weight: ['400', '700', '900'],
})

export const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
})

export const typography = {
  // Display Headings (Landing pages, hero sections)
  display: {
    xl: { fontSize: '4.5rem', lineHeight: '1.1', letterSpacing: '0.08em', fontWeight: 900 },
    lg: { fontSize: '3.5rem', lineHeight: '1.1', letterSpacing: '0.08em', fontWeight: 900 },
    md: { fontSize: '3rem', lineHeight: '1.1', letterSpacing: '0.08em', fontWeight: 900 },
  },
  
  // Heading Hierarchy
  heading: {
    h1: { fontSize: '3rem', lineHeight: '1.2', letterSpacing: '0.06em', fontWeight: 900 },
    h2: { fontSize: '2.5rem', lineHeight: '1.3', letterSpacing: '0.05em', fontWeight: 900 },
    h3: { fontSize: '2rem', lineHeight: '1.4', letterSpacing: '0.04em', fontWeight: 700 },
    h4: { fontSize: '1.5rem', lineHeight: '1.4', letterSpacing: '0.03em', fontWeight: 700 },
    h5: { fontSize: '1.25rem', lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: 700 },
    h6: { fontSize: '1rem', lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: 700 },
  },
  
  // Body Text
  body: {
    lg: { fontSize: '1.125rem', lineHeight: '1.7', fontWeight: 400 },
    base: { fontSize: '1rem', lineHeight: '1.6', fontWeight: 400 },
    sm: { fontSize: '0.875rem', lineHeight: '1.6', fontWeight: 400 },
    xs: { fontSize: '0.75rem', lineHeight: '1.5', fontWeight: 400 },
  },
  
  // Special text styles
  label: { fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.8px' },
  button: { fontSize: '1rem', fontWeight: 700, letterSpacing: '0.04em' },
  code: { fontSize: '0.875rem', fontWeight: 500 },
}
