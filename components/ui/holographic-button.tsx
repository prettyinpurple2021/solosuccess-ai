'use client';

import { motion } from 'framer-motion';
import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface HolographicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  sparkles?: boolean;
  shine?: boolean;
  glow?: boolean;
  className?: string;
}

const sizeVariants = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-12 py-6 text-xl',
};

export const HolographicButton = forwardRef<HTMLButtonElement, HolographicButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    sparkles = true, 
    shine = true, 
    glow = true,
    className,
    disabled,
    ...props 
  }, ref) => {
    return (
      <motion.button
        ref={ref}
        disabled={disabled}
        className={cn(
          'relative font-bold transition-all duration-300 ease-out rounded-2xl',
          'focus:outline-none focus:ring-4 focus:ring-SoloSuccess-purple/30',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'text-white shadow-2xl border border-white/20',
          'backdrop-blur-sm overflow-hidden',
          sizeVariants[size],
          glow && 'hover:shadow-[0_0_40px_rgba(182,33,255,0.6)]',
          className
        )}
        style={{
          background: 'linear-gradient(135deg, #B621FF 0%, #18FFFF 45%, #FF1FAF 100%)',
          backgroundSize: '200% 200%',
          animation: 'holographic-shift 6s ease-in-out infinite',
        }}
        whileHover={!disabled ? { 
          scale: 1.05, 
          y: -2,
          boxShadow: "0 20px 40px rgba(182, 33, 255, 0.4), 0 0 60px rgba(24, 255, 255, 0.3)"
        } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        {...props}
      >
        {/* Glass shine effect - REAL glass reflection */}
        {shine && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        )}
        
        {/* Holographic border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-SoloSuccess-purple via-SoloSuccess-cyan to-SoloSuccess-pink opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        
        {/* Sparkle overlay - DENSE glitter like the reference */}
        {sparkles && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="holo-glitter" />
          </div>
        )}
      </motion.button>
    );
  }
);

HolographicButton.displayName = 'HolographicButton';

interface HolographicCardProps {
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
  interactive = true
}: HolographicCardProps) {
  return (
    <motion.div
      className={cn(
        'relative holo-overlay p-6',
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
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-SoloSuccess-purple/20 via-SoloSuccess-cyan/20 to-SoloSuccess-pink/20 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
    </motion.div>
  );
}

interface HolographicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  sparkles?: boolean;
  shine?: boolean;
}

export function HolographicInput({ 
  label, 
  error, 
  sparkles = false, 
  shine = true,
  className,
  ...props 
}: HolographicInputProps) {
  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      
      <motion.div
        className="relative"
        whileFocusWithin={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <input
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 border-SoloSuccess-purple/20',
            'bg-white/10 backdrop-blur-md text-foreground',
            'focus:border-SoloSuccess-purple focus:ring-4 focus:ring-SoloSuccess-purple/20',
            'focus:outline-none transition-all duration-300',
            'placeholder:text-muted-foreground',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />

        {shine && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 focus-within:opacity-100"
            initial={{ x: '-100%' }}
            whileFocus={{ x: '100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        )}

        {/* Focus glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-SoloSuccess-purple/10 via-SoloSuccess-cyan/10 to-SoloSuccess-pink/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function GradientText({ 
  children, 
  className,
  animate = true 
}: GradientTextProps) {
  return (
    <motion.span
      className={cn(
        'gradient-text font-bold',
        animate && 'animate-holographic-shift',
        className
      )}
      animate={animate ? {
        backgroundPosition: ['0% 0%', '100% 0%', '100% 100%', '0% 100%', '0% 0%']
      } : {}}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.span>
  );
}