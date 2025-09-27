'use client';

import { motion } from 'framer-motion';
import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface HolographicCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  sparkles?: boolean;
  shine?: boolean;
  glow?: boolean;
  interactive?: boolean;
}

export function HolographicCard({ 
  children, 
  className,
  sparkles = true,
  shine = true,
  glow = true,
  interactive = true,
  ...props
}: HolographicCardProps) {
  return (
    <motion.div
      className={cn(
        'relative holo-overlay p-6 rounded-xl border-2 border-purple-100 bg-card text-card-foreground shadow-sm transition-all duration-300',
        glow && 'hover:shadow-[0_0_40px_rgba(182,33,255,0.3)]',
        interactive && 'hover:scale-105 cursor-pointer',
        className
      )}
      whileHover={interactive ? { 
        scale: 1.02, 
        y: -4,
        boxShadow: "0 20px 40px rgba(182, 33, 255, 0.2)"
      } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      {shine && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      )}
      
      <div className="relative z-10">
        {children}
      </div>

      {/* Sparkle overlay - DENSE glitter like the reference */}
      {sparkles && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="holo-glitter" />
        </div>
      )}

      {/* Holographic edge glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-SoloSuccess-purple/20 via-SoloSuccess-cyan/20 to-SoloSuccess-pink/20 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
    </motion.div>
  );
}
