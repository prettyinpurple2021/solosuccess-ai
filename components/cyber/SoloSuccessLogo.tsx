'use client'

import { cn } from '@/lib/utils'

interface SoloSuccessLogoProps {
  className?: string
  size?: number
  animated?: boolean
  variant?: 'default' | 'footer'
}

export function SoloSuccessLogo({ 
  className, 
  size = 48, 
  animated = true,
  variant = 'default'
}: SoloSuccessLogoProps) {
  const viewBox = "0 0 100 100"
  
  return (
    <svg 
      viewBox={viewBox} 
      className={cn(
        "filter drop-shadow-[0_0_8px_rgba(0,243,255,0.6)]",
        animated && variant === 'default' && "origin-center animate-spin-logo",
        className
      )}
      width={size}
      height={size}
      aria-label="SoloSuccess AI Logo"
    >
      <defs>
        <linearGradient id="logo-grad-cyan" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#00f3ff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#0088ff', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="logo-grad-purple" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#bd00ff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#7000ff', stopOpacity: 1 }} />
        </linearGradient>
        {variant === 'footer' && (
          <linearGradient id="footer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#00f3ff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#bd00ff', stopOpacity: 1 }} />
          </linearGradient>
        )}
      </defs>
      
      {/* Outer Rotating Ring */}
      {variant === 'default' && (
        <g className={animated ? "origin-center animate-spin-slow" : ""}>
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            stroke="#333" 
            strokeWidth="1" 
            fill="none" 
            strokeDasharray="10 15" 
            opacity="0.8" 
          />
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            stroke="url(#logo-grad-cyan)" 
            strokeWidth="1" 
            fill="none" 
            strokeDasharray="20 70" 
            opacity="1" 
          />
        </g>
      )}

      {/* Left S (Cyan) */}
      <path 
        d="M50 30 L35 30 L30 40 L30 55 L45 55" 
        stroke={variant === 'footer' ? "url(#footer-grad)" : "url(#logo-grad-cyan)"} 
        strokeWidth={variant === 'footer' ? "4" : "5"} 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M30 55 L30 70 L45 70" 
        stroke={variant === 'footer' ? "url(#footer-grad)" : "url(#logo-grad-cyan)"} 
        strokeWidth={variant === 'footer' ? "4" : "5"} 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Right S (Purple) - Interlocked */}
      <path 
        d="M50 70 L65 70 L70 60 L70 45 L55 45" 
        stroke={variant === 'footer' ? "url(#footer-grad)" : "url(#logo-grad-purple)"} 
        strokeWidth={variant === 'footer' ? "4" : "5"} 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M70 45 L70 30 L55 30" 
        stroke={variant === 'footer' ? "url(#footer-grad)" : "url(#logo-grad-purple)"} 
        strokeWidth={variant === 'footer' ? "4" : "5"} 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Circuit Nodes */}
      {variant === 'default' && (
        <>
          <circle cx="45" cy="70" r="3" fill="#fff" />
          <circle cx="55" cy="30" r="3" fill="#fff" />
        </>
      )}

      {/* Footer variant ring */}
      {variant === 'footer' && (
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          stroke="url(#footer-grad)" 
          strokeWidth="2" 
          fill="none" 
          strokeDasharray="10 5" 
        />
      )}
    </svg>
  )
}

