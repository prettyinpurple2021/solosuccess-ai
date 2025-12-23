'use client'

import { ReactNode } from 'react'
import { NeuralNetworkCanvas } from './NeuralNetworkCanvas'
import { UIOverlayLines } from './UIOverlayLines'
import { CyberNav } from './CyberNav'
import { CyberFooter } from './CyberFooter'

interface CyberPageLayoutProps {
  children: ReactNode
  showNav?: boolean
  showFooter?: boolean
}

export function CyberPageLayout({ 
  children, 
  showNav = true, 
  showFooter = true 
}: CyberPageLayoutProps) {
  return (
    <div className="min-h-screen bg-dark-bg relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      <NeuralNetworkCanvas />
      <UIOverlayLines />
      {showNav && <CyberNav />}
      <main className="relative z-10">
        {children}
      </main>
      {showFooter && <CyberFooter />}
    </div>
  )
}

