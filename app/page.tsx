'use client'

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { NeuralNetworkCanvas } from '@/components/cyber/NeuralNetworkCanvas'
import { UIOverlayLines } from '@/components/cyber/UIOverlayLines'
import { CyberNav } from '@/components/cyber/CyberNav'
import { CyberFooter } from '@/components/cyber/CyberFooter'
import { CyberButton } from '@/components/cyber/CyberButton'
import { Server, Lock, Zap, Crosshair, Brain, Building2 } from 'lucide-react'

const heroStats = [
  { label: 'Active Nodes', value: '10k+' },
  { label: 'Tasks Executed', value: '500k+' },
  { label: 'System Uptime', value: '99.9%' },
]

const modules = [
  { id: '01', title: 'Central Neural Hub', description: '8 specialized autonomous agents ready for input. Centralized control for all data streams.', icon: Server },
  { id: '02', title: 'Quantum-Grade Encryption', description: 'Advanced security protocols. Your proprietary data is secured behind layers of digital armor.', icon: Lock },
  { id: '03', title: 'Instant Implementation', description: 'Launch protocols in under 60 seconds. Zero latency. Instant execution of business logic.', icon: Zap },
  { id: '04', title: 'Algorithmic Targeting', description: 'Hit business objectives with calculated accuracy. Eliminate wasted compute and effort.', icon: Crosshair },
  { id: '05', title: 'Predictive Analytics', description: 'Real-time market intelligence streams. Analyze the dataset clearly before you execute.', icon: Brain },
  { id: '06', title: 'Ecosystem Scaling', description: 'Scale from single node to full network seamlessly. The system adapts as you expand.', icon: Building2 },
]

const tiers = [
  {
    id: 'core',
    title: 'CORE_ACCESS',
    price: 'FREE',
    subtitle: 'No Validation Required',
    bullets: ['Basic Agent Access', 'Neural Hub Lite', 'Network Support'],
    href: '/signup',
    accent: 'cyan',
    badge: null,
  },
  {
    id: 'pro',
    title: 'ARCHITECT_PRO',
    price: 'SCALE',
    subtitle: 'Full System Suite',
    bullets: ['8 Specialized Agents', 'Unlimited Processes', 'Priority Data Streams', 'Quantum Encryption+'],
    href: '/signup',
    accent: 'purple',
    badge: 'RECOMMENDED',
  },
]

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: 'easeOut' },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cyber-black relative overflow-hidden text-gray-100">
      <NeuralNetworkCanvas particleCount={90} connectionDistance={170} mouseDistance={240} />
      <UIOverlayLines />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,240,255,0.08),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(255,0,183,0.08),transparent_35%),radial-gradient(circle_at_50%_70%,rgba(0,240,255,0.06),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(0,240,255,0.05),rgba(255,0,183,0.08),rgba(0,240,255,0.05))]" />
      </div>

      <CyberNav />

      <main className="relative z-10">
        <section className="pt-28 lg:pt-32 pb-20">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.08fr,0.92fr] gap-12 items-center">
            <motion.div {...fadeIn} className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyber-cyan/40 bg-cyber-cyan/10 uppercase tracking-[0.25em] text-[11px] text-cyber-cyan">
                <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-pulse" aria-hidden="true" />
                Neural Link Established
              </div>

              <div className="space-y-4">
                <h1 className="font-sci font-bold leading-[1.05] text-white text-5xl md:text-7xl">
                  YOUR AI CO-
                  <span className="block bg-gradient-to-r from-cyber-cyan via-white to-cyber-purple text-transparent bg-clip-text">
                    CO-FOUNDER
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-xl border-l-2 border-cyber-purple/70 pl-6">
                  Upgrade your business infrastructure with autonomous intelligence. Automate your workflow, optimize your sector, and scale with algorithmic precision.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="#deploy">
                  <CyberButton variant="secondary" size="lg" className="rounded-none">
                    INITIALIZE_SYSTEM
                  </CyberButton>
                </Link>
                <Link href="#features">
                  <CyberButton variant="ghost" size="lg" className="rounded-none">
                    VIEW_ARCHITECTURE
                  </CyberButton>
                </Link>
              </div>

              <div className="flex flex-wrap gap-8 pt-6">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <div className="text-3xl font-sci font-bold text-white">{stat.value}</div>
                    <div className="text-[11px] uppercase tracking-[0.3em] text-cyber-cyan/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.1 }}>
              <div className="relative border border-cyber-cyan/40 bg-cyber-dark/80 shadow-[0_0_30px_rgba(0,240,255,0.12)] p-8">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="font-sci text-xs uppercase tracking-[0.25em] text-cyber-cyan">
                    Objective: Market Singularity
                  </span>
                  <div className="w-7 h-7 rounded-full border border-cyber-purple/40 flex items-center justify-center">
                    <div className="w-3 h-3 bg-cyber-cyan rounded-full" />
                  </div>
                </div>

                <div className="space-y-5 mt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-semibold uppercase tracking-[0.18em]">
                      <span className="text-gray-300">Modules_Active</span>
                      <span className="text-cyber-cyan">8/8 Online</span>
                    </div>
                    <div className="h-1.5 bg-white/5 overflow-hidden">
                      <div className="h-full w-full bg-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.35)]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-semibold uppercase tracking-[0.18em]">
                      <span className="text-gray-300">Scale_Velocity</span>
                      <span className="text-cyber-purple">Stabilizing</span>
                    </div>
                    <div className="h-1.5 bg-white/5 overflow-hidden">
                      <div className="h-full w-2/3 bg-gradient-to-r from-cyber-purple to-cyber-cyan animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                  <div className="rounded-none bg-cyber-cyan/5 border border-cyber-cyan/30 p-3">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-gray-400">Mode</div>
                    <div className="font-sci text-lg text-white">Autonomous</div>
                  </div>
                  <div className="rounded-none bg-cyber-purple/5 border border-cyber-purple/30 p-3">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-gray-400">Encryption</div>
                    <div className="font-sci text-lg text-cyber-purple">Quantum</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-20 relative">
          <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent" />
          <div className="max-w-7xl mx-auto px-6 space-y-10">
            <div className="space-y-2">
              <span className="text-cyber-purple font-sci text-sm tracking-[0.3em]">/// SYSTEM_CAPABILITIES</span>
              <h2 className="text-4xl font-sci font-bold text-white">
                NEURAL_MODULES <span className="text-cyber-cyan align-middle">_</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map(({ id, title, description, icon: Icon }) => (
                <div
                  key={id}
                  className="rounded-none border border-cyber-cyan/20 bg-cyber-dark/70 p-6 hover:border-cyber-cyan/60 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-sci text-2xl font-bold text-white/30">{id}</span>
                    <Icon className="w-5 h-5 text-cyber-purple" aria-hidden="true" />
                  </div>
                  <h3 className="font-sci text-lg text-white mb-2">{title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="deploy" className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-14 space-y-3">
              <h2 className="text-3xl font-sci font-bold text-white">INITIALIZE SEQUENCE</h2>
              <p className="text-cyber-cyan font-tech tracking-[0.28em] uppercase">
                Join the network of autonomous founders.
              </p>
              <div className="w-24 h-1 bg-cyber-purple mx-auto shadow-[0_0_15px_#ff00b7]" />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`rounded-none border border-white/10 bg-cyber-dark/70 text-center relative overflow-hidden ${
                    tier.id === 'pro' ? 'shadow-[0_0_25px_rgba(255,0,183,0.2)] border-cyber-purple/40' : ''
                  }`}
                >
                  {tier.badge ? (
                    <div className="absolute top-0 right-0 bg-cyber-purple text-white text-[10px] font-bold px-3 py-1 font-sci tracking-[0.2em]">
                      {tier.badge}
                    </div>
                  ) : null}

                  <h3 className={`font-sci text-xl ${tier.accent === 'purple' ? 'text-cyber-purple' : 'text-cyber-cyan'}`}>
                    {tier.title}
                  </h3>
                  <div className="text-4xl font-sci font-bold text-white mt-4 mb-2">{tier.price}</div>
                  <span
                    className={`text-xs font-tech uppercase tracking-[0.25em] mb-8 block ${
                      tier.accent === 'purple' ? 'text-cyber-purple' : 'text-cyber-cyan'
                    }`}
                  >
                    {tier.subtitle}
                  </span>

                  <ul className="space-y-3 mb-8 text-sm font-tech text-gray-300 text-left max-w-xs mx-auto">
                    {tier.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2">
                        <span
                          className={`${tier.accent === 'purple' ? 'text-cyber-purple' : 'text-cyber-cyan'} text-base leading-none`}
                          aria-hidden="true"
                        >
                          {'>>'}
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={tier.href}>
                    <CyberButton
                      variant={tier.id === 'pro' ? 'primary' : 'secondary'}
                      size="md"
                      className="rounded-none px-8"
                    >
                      {tier.id === 'pro' ? 'Full Upgrade' : 'Start Sequence'}
                    </CyberButton>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <CyberFooter />
    </div>
  )
}
