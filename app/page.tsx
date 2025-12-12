'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { NeuralNetworkCanvas } from '@/components/cyber/NeuralNetworkCanvas'
import { Server, Zap, Brain, ChevronRight } from 'lucide-react'

// --- Types & Interfaces ---
interface HudMetricProps {
  label: string
  value: string
  status: 'active' | 'stabilizing' | 'offline'
  pcolor: string
}

// --- Components ---

const HudMetric = ({ label, value, status, pcolor }: HudMetricProps) => (
  <div className="space-y-1 font-mono text-xs tracking-wider">
    <div className="flex justify-between items-end text-[#8892b0]">
      <span>{label}</span>
      <span className={status === 'active' ? 'text-[#00F0FF]' : 'text-[#BC13FE]'}>
        {value}
      </span>
    </div>
    <div className="h-1 w-full bg-[#1a1b26] relative overflow-hidden">
      <div 
        className={`absolute top-0 left-0 h-full ${pcolor === 'cyan' ? 'bg-[#00F0FF]' : 'bg-[#BC13FE]'}`} 
        style={{ width: status === 'active' ? '100%' : '60%' }}
      >
        {status === 'stabilizing' && (
          <div className="absolute inset-0 bg-white/30 animate-[shimmer_1s_infinite]" />
        )}
      </div>
    </div>
  </div>
)

const BracketCorner = ({ position }: { position: string }) => {
  const styles = {
    'tl': 'top-0 left-0 border-t-2 border-l-2',
    'tr': 'top-0 right-0 border-t-2 border-r-2',
    'bl': 'bottom-0 left-0 border-b-2 border-l-2',
    'br': 'bottom-0 right-0 border-b-2 border-r-2',
  }
  return (
    <div className={`absolute w-3 h-3 border-[#00F0FF] ${styles[position as keyof typeof styles]}`} />
  )
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="min-h-screen bg-[#020204] relative overflow-hidden flex flex-col items-center justify-center selection:bg-[#00F0FF] selection:text-black">
      {/* 1. Global Background Effects */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <NeuralNetworkCanvas particleCount={60} connectionDistance={150} mouseDistance={200} />
      </div>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-[1240px] px-6 lg:px-8 mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0 pt-20 lg:pt-0 min-h-[calc(100vh-80px)]">
        
        {/* --- LEFT COLUMN: CONTENT (Text/Headline) --- */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-[48%] space-y-8 text-center lg:text-left relative z-20"
        >
          {/* Headline */}
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 mb-2 border border-[#00F0FF]/30 bg-[#00F0FF]/5 rounded-sm">
              <span className="font-mono text-[10px] text-[#00F0FF] tracking-[0.2em] uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#00F0FF] rounded-full animate-pulse" />
                System initialized
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-sci tracking-tight leading-[1.1] text-white">
              YOUR AI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#BC13FE] animate-pulse">
                CO-FOUNDER
              </span>
            </h1>
          </div>

          {/* Subtext */}
          <p className="text-[#8892b0] text-lg md:text-xl max-w-[550px] mx-auto lg:mx-0 leading-relaxed font-sans">
            Deploy an autonomous workforce. Scale your operations with a neural network of specialized AI agents working 24/7.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <Link href="/register">
              <button className="group relative px-8 py-4 bg-transparent border border-[#00F0FF] text-[#00F0FF] font-sci tracking-widest uppercase text-sm transition-all hover:bg-[#00F0FF]/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                <span className="relative z-10">Initialize_Core</span>
              </button>
            </Link>
            
            <Link href="/about">
              <button className="group px-8 py-4 bg-transparent text-white font-sci tracking-widest uppercase text-sm border border-transparent hover:border-white/20 transition-all opacity-70 hover:opacity-100">
                System_Overview
              </button>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="flex flex-row justify-center lg:justify-start gap-12 border-t border-white/5 pt-8 mt-2">
            {[
              { label: 'Active Nodes', value: '10K+' },
              { label: 'Uptime', value: '99.9%' },
              { label: 'Tasks', value: '500K+' },
            ].map((stat, i) => (
              <div key={i} className="text-center lg:text-left">
                <div className="text-2xl font-mono text-white mb-1">{stat.value}</div>
                <div className="text-[10px] text-[#8892b0] uppercase tracking-widest font-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* --- RIGHT COLUMN: HUD VISUAL --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-[45%] relative z-10"
        >
          {/* HUD Container */}
          <div className="relative bg-[#020204]/90 border border-[#00F0FF]/50 p-6 md:p-8 backdrop-blur-md shadow-[0_0_40px_rgba(0,240,255,0.1)] group hover:border-[#00F0FF] transition-colors duration-500">
            
            {/* Corner Accents */}
            <BracketCorner position="tl" />
            <BracketCorner position="tr" />
            <BracketCorner position="bl" />
            <BracketCorner position="br" />

            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-[#00F0FF]/20 pb-4">
              <div className="font-mono text-xs text-[#00F0FF] tracking-[0.2em] flex items-center gap-2">
                <Server size={14} />
                <span>TERMINAL_01</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-[#00F0FF]/30 rounded-full" />
                <div className="w-2 h-2 bg-[#00F0FF]/30 rounded-full" />
              </div>
            </div>

            {/* Main Visual Content */}
            <div className="space-y-8">
              <div className="text-center py-4 relative">
                 <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Brain size={120} className="text-[#BC13FE] animate-pulse" />
                 </div>
                 <h3 className="relative z-10 font-mono text-sm text-[#8892b0] mb-2 tracking-widest uppercase">
                   Current Objective
                 </h3>
                 <p className="relative z-10 font-sci text-3xl text-white font-bold tracking-wider drop-shadow-[0_0_10px_rgba(188,19,254,0.5)]">
                   MARKET_SINGULARITY
                 </p>
              </div>

              {/* Progress Bars */}
              <div className="space-y-6">
                <HudMetric 
                  label="DEDICATED AGENTS" 
                  value="8/8 ONLINE" 
                  status="active" 
                  pcolor="cyan" 
                />
                <HudMetric 
                  label="NEURAL SYNC" 
                  value="STABILIZING..." 
                  status="stabilizing" 
                  pcolor="purple" 
                />
              </div>

              {/* Terminal Log Output */}
              <div className="mt-6 p-4 bg-black/80 border border-white/10 font-mono text-[10px] text-[#8892b0] rounded-sm h-32 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#020204]/90 pointer-events-none" />
                <div className="space-y-2 opacity-80">
                  <p><span className="text-[#00F0FF]">{'>'}</span> Initializing core protocols...</p>
                  <p><span className="text-[#00F0FF]">{'>'}</span> Loading competitor_data.json...</p>
                  <p><span className="text-[#00F0FF]">{'>'}</span> Optimizing neural pathways...</p>
                  <p><span className="text-[#BC13FE]">{'>'}</span> Connection established.</p>
                  <p className="animate-pulse"><span className="text-[#00F0FF]">{'>'}</span> Awaiting user input_</p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </main>
  )
}