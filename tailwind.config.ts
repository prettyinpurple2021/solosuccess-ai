import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // Cyberpunk Design System Colors
        cyber: {
          black: '#020005',
          dark: '#0a0514',
          cyan: '#00f3ff',
          purple: '#bd00ff',
          dim: 'rgba(0, 243, 255, 0.1)',
        },
        // Military Glassmorphic Design System Colors (kept for backward compatibility)
        military: {
          'hot-pink': '#FF71B5',
          'blush-pink': '#FFB3D9',
          'dusty-rose': '#F7BAC8',
          'gunmetal': '#5D5C61',
          'storm-grey': '#B2B2B2',
          'charcoal': '#454547',
          'midnight': '#18181A',
          'tactical': '#232325',
          'glass-white': '#FAFAFA',
        },
        // AI Agent Colors
        agent: {
          roxy: '#6366F1',     // Executive Assistant
          blaze: '#F59E0B',     // Growth Strategist
          echo: '#EC4899',      // Marketing Maven
          lumi: '#3B82F6',      // Legal & Docs
          vex: '#10B981',      // Technical Architect
          lexi: '#8B5CF6',      // Strategy Analyst
          nova: '#06B6D4',      // Product Designer
          glitch: '#EF4444',    // QA & Debug
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Cyberpunk animations
        "pulse-fast": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "spin-logo": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "glitch-anim": {
          "0%": { clip: "rect(14px, 9999px, 122px, 0)" },
          "5%": { clip: "rect(69px, 9999px, 36px, 0)" },
          "10%": { clip: "rect(26px, 9999px, 20px, 0)" },
          "100%": { clip: "rect(0, 0, 0, 0)" },
        },
        "glitch-anim-2": {
          "0%": { clip: "rect(12px, 9999px, 66px, 0)" },
          "5%": { clip: "rect(98px, 9999px, 4px, 0)" },
          "10%": { clip: "rect(23px, 9999px, 93px, 0)" },
          "100%": { clip: "rect(0, 0, 0, 0)" },
        },
        // Military glassmorphic animations (kept for backward compatibility)
        "glass-shine": {
          "0%": { transform: "translateX(-100%) skewX(-15deg)" },
          "100%": { transform: "translateX(200%) skewX(-15deg)" },
        },
        "tactical-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 113, 181, 0.7)" },
          "50%": { boxShadow: "0 0 0 12px rgba(255, 113, 181, 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Cyberpunk animations
        "pulse-fast": "pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin-slow 12s linear infinite",
        "spin-logo": "spin-logo 20s linear infinite",
        "glitch-anim": "glitch-anim 2.5s infinite linear alternate-reverse",
        "glitch-anim-2": "glitch-anim-2 3s infinite linear alternate-reverse",
        // Military glassmorphic animations (kept for backward compatibility)
        "glass-shine": "glass-shine 2.5s ease-in-out infinite",
        "tactical-pulse": "tactical-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      boxShadow: {
        'neon-cyan': '0 0 10px #00f3ff, 0 0 20px #00f3ff',
        'neon-purple': '0 0 10px #bd00ff, 0 0 20px #bd00ff',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // Military Glassmorphic Gradients
        'gradient-military': 'linear-gradient(135deg, #FF71B5 0%, #5D5C61 50%, #232325 100%)',
        'gradient-tactical': 'linear-gradient(135deg, #FFB3D9 0%, #B2B2B2 50%, #454547 100%)',
        'gradient-camo': 'linear-gradient(135deg, #FF71B5 0%, #5D5C61 25%, #232325 50%, #B2B2B2 75%, #454547 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 113, 181, 0.1) 0%, rgba(93, 92, 97, 0.1) 50%, rgba(35, 35, 37, 0.1) 100%)',
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        // Cyberpunk fonts
        sci: ["Orbitron", "sans-serif"],
        tech: ["Rajdhani", "sans-serif"],
        // Legacy font aliases (kept for backward compatibility)
        boss: ["Orbitron", "sans-serif"],
        heading: ["Orbitron", "Rajdhani", "sans-serif"],
        tactical: ["Chakra Petch", "Rajdhani", "monospace"],
      },
      // ... (your other extensions like spacing, maxWidth, zIndex are fine)
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config