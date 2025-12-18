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
    <div className="min-h-screen bg-cyber-black relative overflow-hidden">
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

