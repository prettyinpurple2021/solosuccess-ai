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
        // SoloSuccess Brand Colors - Updated for Holographic Theme
        SoloSuccess: {
          purple: '#B621FF',
          cyan: '#18FFFF', 
          pink: '#FF1FAF',
          black: '#000000',
          'purple-light': '#D946EF',
          'cyan-light': '#67E8F9',
          'pink-light': '#FF6BB3',
          'purple-dark': '#9333EA',
          'cyan-dark': '#0891B2',
          'pink-dark': '#E91E63',
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
        // ... (other keyframes are correct and can remain as they are)
        "holo-shimmer": {
          "0%": { transform: "translateX(-100%) rotate(45deg)" },
          "100%": { transform: "translateX(100%) rotate(45deg)" },
        },
        "sparkle-twinkle": {
          "0%, 100%": { opacity: "0", transform: "scale(0.5) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1) rotate(180deg)" },
        },
        "glass-shine": {
          "0%": { transform: "translateX(-100%) skewX(-15deg)" },
          "100%": { transform: "translateX(200%) skewX(-15deg)" },
        },
        "rainbow-rotate": {
          "0%": { filter: "hue-rotate(0deg)" },
          "100%": { filter: "hue-rotate(360deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(182, 33, 255, 0.3), 0 0 40px rgba(24, 255, 255, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 31, 175, 0.5), 0 0 80px rgba(182, 33, 255, 0.3)" },
        },
        "holographic-shift": {
          "0%": { backgroundPosition: "0% 0%" },
          "25%": { backgroundPosition: "100% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
          "75%": { backgroundPosition: "0% 100%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // ... (other animations are correct and can remain as they are)
        "holo-shimmer": "holo-shimmer 3s ease-in-out infinite",
        "sparkle-twinkle": "sparkle-twinkle 2s ease-in-out infinite",
        "glass-shine": "glass-shine 2.5s ease-in-out infinite",
        "rainbow-rotate": "rainbow-rotate 4s linear infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "holographic-shift": "holographic-shift 8s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // SoloSuccess Holographic Gradients (These already match your design system perfectly!)
        'gradient-hero': 'linear-gradient(135deg, #B621FF 0%, #18FFFF 45%, #FF1FAF 100%)',
        'gradient-card': 'linear-gradient(120deg, #B621FF 0%, #FF1FAF 100%)',
        'gradient-holographic': 'linear-gradient(135deg, #B621FF 0%, #18FFFF 20%, #FF1FAF 40%, #18FFFF 60%, #B621FF 80%, #FF1FAF 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(182, 33, 255, 0.1) 0%, rgba(24, 255, 255, 0.1) 50%, rgba(255, 31, 175, 0.1) 100%)',
        'gradient-sparkle': 'conic-gradient(from 0deg, #B621FF, #18FFFF, #FF1FAF, #18FFFF, #B621FF)',
        // ... (your other custom and AI agent gradients can remain)
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        // ✨ NEW: Add the custom 'boss' font family here
        boss: ["Orbitron", "sans-serif"], 
      },
      // ... (your other extensions like spacing, maxWidth, zIndex are fine)
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config