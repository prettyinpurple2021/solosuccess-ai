'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SoloSuccessLogo } from '@/components/cyber/SoloSuccessLogo'
import { CyberButton } from '@/components/cyber/CyberButton'

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed w-full z-50 top-0 bg-cyber-black/80 backdrop-blur-md border-b border-cyber-cyan/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <SoloSuccessLogo size={48} animated={true} />
          <div className="flex flex-col">
            <span className="font-sci font-bold text-xl tracking-widest text-white">
              SOLO<span className="text-cyber-cyan">SUCCESS</span>.AI
            </span>
            <span className="text-[10px] text-cyber-purple tracking-[0.3em] uppercase">
              Status: Online
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink label="Features" path="/features" isActive={isActive('/features')} />
          <NavLink label="Pricing" path="/pricing" isActive={isActive('/pricing')} />
          <NavLink label="About" path="/about" isActive={isActive('/about')} />
          <NavLink label="Contact" path="/contact" isActive={isActive('/contact')} />
        </div>

        <div className="flex items-center gap-4">
          <Link href="/signin" className="hidden sm:block">
            <span className="text-sm font-bold uppercase tracking-widest hover:text-cyber-cyan transition-colors text-gray-400">
              LOGIN
            </span>
          </Link>
          <Link href="/signup">
            <CyberButton variant="ghost" size="sm">
              Get Started
            </CyberButton>
          </Link>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ label, path, isActive }: { label: string, path: string, isActive: boolean }) {
  return (
    <Link
      href={path}
      className={`text-sm font-bold uppercase tracking-widest transition-colors ${
        isActive ? 'text-cyber-cyan' : 'text-gray-400 hover:text-cyber-cyan'
      }`}
    >
      {label}
    </Link>
  )
}
