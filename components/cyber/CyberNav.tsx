'use client'

import Link from 'next/link'
import { SoloSuccessLogo } from './SoloSuccessLogo'
import { CyberButton } from './CyberButton'

export function CyberNav() {
  return (
    <nav className="fixed w-full z-50 top-0 bg-cyber-black/80 backdrop-blur-md border-b border-cyber-cyan/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SoloSuccessLogo size={48} animated={true} />
          <div className="flex flex-col">
            <span className="font-sci font-bold text-xl tracking-widest text-white">
              SOLO<span className="text-cyber-cyan">SUCCESS</span>.AI
            </span>
            <span className="text-[10px] text-cyber-purple tracking-[0.3em] uppercase">
              SYSTEM_OPERATIONAL
            </span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="#features" 
            className="text-sm font-bold uppercase tracking-widest hover:text-cyber-cyan transition-colors text-gray-400"
          >
            Core_Functions
          </Link>
          <Link 
            href="#deploy" 
            className="text-sm font-bold uppercase tracking-widest hover:text-cyber-cyan transition-colors text-gray-400"
          >
            Initialize
          </Link>
          <Link href="/signin">
            <CyberButton variant="ghost" size="sm">
              USER_LOGIN
            </CyberButton>
          </Link>
        </div>
      </div>
    </nav>
  )
}

