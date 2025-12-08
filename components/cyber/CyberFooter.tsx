'use client'

import Link from 'next/link'
import { SoloSuccessLogo } from './SoloSuccessLogo'

export function CyberFooter() {
  return (
    <footer className="border-t border-white/5 bg-black py-12 relative z-10 text-center">
      <div className="flex justify-center mb-6">
        <SoloSuccessLogo size={48} animated={false} variant="footer" />
      </div>
      <p className="font-tech text-gray-500 text-sm">
        SYSTEM STATUS: ONLINE <br />
        © 2025 SoloSuccess AI. All rights reserved. <br />
        <span className="text-[10px] text-cyber-dim mt-2 block">
          ENCHANTED NIGHTMARE INDUSTRIES
        </span>
      </p>
    </footer>
  )
}

