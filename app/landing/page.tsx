'use client'

import Link from 'next/link'
import { NeuralNetworkCanvas } from '@/components/cyber/NeuralNetworkCanvas'
import { UIOverlayLines } from '@/components/cyber/UIOverlayLines'
import { InlineSSLogo } from '@/components/cyber/InlineSSLogo'
import { 
  FaServer, 
  FaLock, 
  FaBolt, 
  FaCrosshairs, 
  FaBrain,
  FaCity 
} from 'react-icons/fa'

// Avoid static prerender failures when feature-flag SDK keys are absent in build envs
export const dynamic = 'force-dynamic'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cyber-black text-gray-300 font-tech overflow-x-hidden relative">
      {/* Canvas Background */}
      <NeuralNetworkCanvas particleCount={60} connectionDistance={150} mouseDistance={200} />

      {/* UI Overlay Lines */}
      <UIOverlayLines />

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 bg-cyber-black/80 backdrop-blur-md border-b border-cyber-cyan/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InlineSSLogo size={48} animated={true} />
            <div className="flex flex-col">
              <span className="font-sci font-bold text-xl tracking-widest text-white">
                SOLO<span className="text-cyber-cyan">SUCCESS</span>.AI
              </span>
              <span className="text-[10px] text-cyber-purple tracking-[0.3em] uppercase">
                System: Operational
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
            <Link 
              href="/signin"
              className="relative px-6 py-2 overflow-hidden group bg-transparent border border-cyber-purple/50 inline-block"
            >
              <span className="absolute w-0 h-full bg-cyber-purple left-0 top-0 transition-all duration-300 group-hover:w-full opacity-20" />
              <span className="font-sci text-xs font-bold text-cyber-purple tracking-widest group-hover:text-white relative z-10">
                USER_LOGIN
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:min-h-screen flex items-center z-10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyber-cyan/30 bg-cyber-cyan/5 rounded-none">
              <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-ping" />
              <span className="text-xs font-bold tracking-widest text-cyber-cyan uppercase">
                Neural Link Established ⚡
              </span>
            </div>

            <h1 className="font-sci text-5xl md:text-7xl font-bold leading-tight text-white glitch-text" data-text="YOUR AI CO-FOUNDER">
              YOUR AI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-white to-cyber-purple">
                CO-FOUNDER
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-lg border-l-2 border-cyber-purple pl-6">
              Upgrade your business infrastructure with autonomous intelligence. Automate your workflow, optimize your sector, and scale with algorithmic precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="#deploy" className="group relative px-8 py-4 bg-cyber-cyan/10 border border-cyber-cyan overflow-hidden">
                <div className="absolute inset-0 w-0 bg-cyber-cyan transition-all duration-[250ms] ease-out group-hover:w-full opacity-20" />
                <span className="relative font-sci font-bold tracking-widest text-cyber-cyan group-hover:text-white">
                  INITIALIZE_SYSTEM
                </span>
              </Link>
              <Link href="#features" className="group relative px-8 py-4 border border-gray-600 hover:border-cyber-purple overflow-hidden">
                <span className="relative font-sci font-bold tracking-widest text-gray-300 group-hover:text-cyber-purple">
                  VIEW_ARCHITECTURE
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-8 opacity-70">
              <div>
                <div className="text-2xl font-sci font-bold text-white">10k+</div>
                <div className="text-[10px] uppercase tracking-widest text-cyber-cyan">Active Nodes</div>
              </div>
              <div>
                <div className="text-2xl font-sci font-bold text-white">500k+</div>
                <div className="text-[10px] uppercase tracking-widest text-cyber-cyan">Tasks Executed</div>
              </div>
              <div>
                <div className="text-2xl font-sci font-bold text-white">99.9%</div>
                <div className="text-[10px] uppercase tracking-widest text-cyber-cyan">System Uptime</div>
              </div>
            </div>
          </div>

          {/* Hero Graphic (3D HUD Element) */}
          <div className="relative hidden lg:block">
            {/* Outer Ring */}
            <div className="absolute inset-0 border border-dashed border-cyber-cyan/20 rounded-full animate-spin-slow" />
            {/* Inner Ring */}
            <div className="absolute inset-10 border border-cyber-purple/20 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            
            <div className="relative bg-cyber-dark/80 backdrop-blur-xl border border-cyber-cyan/30 p-1">
              {/* Decorative Corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan" />

              {/* Inner Content */}
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="font-sci text-xs text-cyber-cyan">OBJECTIVE: MARKET SINGULARITY</span>
                  {/* SVG Mini Logo in Dashboard */}
                  <svg viewBox="0 0 100 100" className="w-6 h-6 animate-pulse">
                    <circle cx="50" cy="50" r="40" stroke="#bd00ff" strokeWidth="4" fill="none" />
                    <circle cx="50" cy="50" r="20" fill="#00f3ff" />
                  </svg>
                </div>
                
                {/* Progress Bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>MODULES_ACTIVE</span>
                      <span className="text-cyber-cyan">8/8 ONLINE</span>
                    </div>
                    <div className="h-1 bg-gray-800 w-full overflow-hidden">
                      <div className="h-full bg-cyber-cyan w-full shadow-[0_0_10px_#00f3ff]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>SCALE_VELOCITY</span>
                      <span className="text-cyber-purple">CALCULATING...</span>
                    </div>
                    <div className="h-1 bg-gray-800 w-full overflow-hidden">
                      <div className="h-full bg-cyber-purple w-2/3 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Data Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-cyber-cyan/5 p-3 border border-cyber-cyan/10">
                    <div className="text-[10px] text-gray-500">MODE</div>
                    <div className="font-sci text-sm">AUTONOMOUS</div>
                  </div>
                  <div className="bg-cyber-purple/5 p-3 border border-cyber-purple/10">
                    <div className="text-[10px] text-gray-500">ENCRYPTION</div>
                    <div className="font-sci text-sm text-cyber-purple">QUANTUM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 relative z-10">
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <span className="text-cyber-purple font-sci text-sm tracking-widest">/// SYSTEM_CAPABILITIES</span>
            <h2 className="text-4xl font-sci font-bold text-white mt-2">
              NEURAL_MODULES <span className="text-cyber-cyan blinking">_</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="hud-border p-6 group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="font-sci text-2xl font-bold text-white/20 group-hover:text-cyber-cyan transition-colors">01</span>
                <FaServer className="text-cyber-purple text-xl" />
              </div>
              <h3 className="font-sci text-lg text-white mb-2">Central Neural Hub</h3>
              <p className="text-sm text-gray-400 font-tech leading-relaxed">
                8 specialized autonomous agents ready for input. Centralized control for all data streams.
              </p>
            </div>

            {/* Card 2 */}
            <div className="hud-border p-6 group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="font-sci text-2xl font-bold text-white/20 group-hover:text-cyber-cyan transition-colors">02</span>
                <FaLock className="text-cyber-purple text-xl" />
              </div>
              <h3 className="font-sci text-lg text-white mb-2">Quantum-Grade Encryption</h3>
              <p className="text-sm text-gray-400 font-tech leading-relaxed">
                Advanced security protocols. Your proprietary data is secured behind layers of digital armor.
              </p>
            </div>

            {/* Card 3 */}
            <div className="hud-border p-6 group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="font-sci text-2xl font-bold text-white/20 group-hover:text-cyber-cyan transition-colors">03</span>
                <FaBolt className="text-cyber-purple text-xl" />
              </div>
              <h3 className="font-sci text-lg text-white mb-2">Instant Implementation</h3>
              <p className="text-sm text-gray-400 font-tech leading-relaxed">
                Launch protocols in under 60 seconds. Zero latency. Instant execution of business logic.
              </p>
            </div>

            {/* Card 4 */}
            <div className="hud-border p-6 group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="font-sci text-2xl font-bold text-white/20 group-hover:text-cyber-cyan transition-colors">04</span>
                <FaCrosshairs className="text-cyber-purple text-xl" />
              </div>
              <h3 className="font-sci text-lg text-white mb-2">Algorithmic Targeting</h3>
              <p className="text-sm text-gray-400 font-tech leading-relaxed">
                Hit business objectives with calculated accuracy. Eliminate wasted compute and effort.
              </p>
            </div>

            {/* Card 5 */}
            <div className="hud-border p-6 group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="font-sci text-2xl font-bold text-white/20 group-hover:text-cyber-cyan transition-colors">05</span>
                <FaBrain className="text-cyber-purple text-xl" />
              </div>
              <h3 className="font-sci text-lg text-white mb-2">Predictive Analytics</h3>
              <p className="text-sm text-gray-400 font-tech leading-relaxed">
                Real-time market intelligence streams. Analyze the dataset clearly before you execute.
              </p>
            </div>

            {/* Card 6 */}
            <div className="hud-border p-6 group cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="font-sci text-2xl font-bold text-white/20 group-hover:text-cyber-cyan transition-colors">06</span>
                <FaCity className="text-cyber-purple text-xl" />
              </div>
              <h3 className="font-sci text-lg text-white mb-2">Ecosystem Scaling</h3>
              <p className="text-sm text-gray-400 font-tech leading-relaxed">
                Scale from single node to full network seamlessly. The system adapts as you expand.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Deployment / Pricing Section */}
      <div id="deploy" className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-sci font-bold text-white">INITIALIZE SEQUENCE</h2>
            <p className="text-cyber-cyan mt-2 font-tech tracking-widest uppercase">
              Join the network of autonomous founders.
            </p>
            <div className="w-24 h-1 bg-cyber-purple mx-auto mt-4 shadow-[0_0_15px_#bd00ff]" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <div className="hud-border p-8 flex flex-col items-center text-center">
              <h3 className="font-sci text-xl text-gray-400">CORE_ACCESS</h3>
              <div className="text-4xl font-sci font-bold text-white mt-4 mb-2">FREE</div>
              <span className="text-xs font-tech text-cyber-cyan uppercase tracking-widest mb-8">
                No Validation Required
              </span>
              
              <ul className="space-y-3 mb-8 text-sm font-tech text-gray-400 w-full text-left pl-8">
                <li className="flex items-center">
                  <span className="text-cyber-cyan mr-2">&gt;&gt;</span> Basic Agent Access
                </li>
                <li className="flex items-center">
                  <span className="text-cyber-cyan mr-2">&gt;&gt;</span> Neural Hub Lite
                </li>
                <li className="flex items-center">
                  <span className="text-cyber-cyan mr-2">&gt;&gt;</span> Network Support
                </li>
              </ul>

              <Link 
                href="/register" 
                className="w-full py-3 border border-gray-600 hover:border-cyber-cyan text-white font-sci text-sm font-bold uppercase transition-colors block text-center"
              >
                Start Sequence
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="hud-border p-8 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-cyber-purple text-white text-[10px] font-bold px-3 py-1 font-sci">
                RECOMMENDED
              </div>
              
              <h3 className="font-sci text-xl text-cyber-purple">ARCHITECT_PRO</h3>
              <div className="text-4xl font-sci font-bold text-white mt-4 mb-2">SCALE</div>
              <span className="text-xs font-tech text-cyber-purple uppercase tracking-widest mb-8">
                Full System Suite
              </span>
              
              <ul className="space-y-3 mb-8 text-sm font-tech text-gray-300 w-full text-left pl-8">
                <li className="flex items-center">
                  <span className="text-cyber-purple mr-2">&gt;&gt;</span> 8 Specialized Agents
                </li>
                <li className="flex items-center">
                  <span className="text-cyber-purple mr-2">&gt;&gt;</span> Unlimited Processes
                </li>
                <li className="flex items-center">
                  <span className="text-cyber-purple mr-2">&gt;&gt;</span> Priority Data Streams
                </li>
                <li className="flex items-center">
                  <span className="text-cyber-purple mr-2">&gt;&gt;</span> Quantum Encryption+
                </li>
              </ul>

              <Link 
                href="/register" 
                className="w-full py-3 bg-cyber-purple/20 border border-cyber-purple hover:bg-cyber-purple hover:text-white text-cyber-purple font-sci text-sm font-bold uppercase transition-all shadow-[0_0_15px_rgba(189,0,255,0.2)] block text-center"
              >
                Full Upgrade
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black py-12 relative z-10 text-center">
        {/* Footer Logo */}
        <div className="flex justify-center mb-6">
          <InlineSSLogo size={48} animated={false} />
        </div>
        <p className="font-tech text-gray-500 text-sm">
          SYSTEM STATUS: ONLINE <br />
          © 2025 SoloSuccess AI. All rights reserved. <br />
          <span className="text-[10px] text-cyber-dim mt-2 block">
            ENCHANTED NIGHTMARE INDUSTRIES
          </span>
        </p>
      </footer>
    </div>
  )
}
