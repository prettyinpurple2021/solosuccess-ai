'use client';

import { motion } from 'framer-motion';
import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';
import { SparkleAnimation, GlassShine } from './sparkle-animation';
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

const buttonVariants = {
  primary: 'bg-gradient-hero text-white border-0',
  secondary: 'bg-gradient-card text-white border-0',
  accent: 'bg-gradient-SoloSuccess text-white border-0',
  ghost: 'bg-transparent text-SoloSuccess-purple border border-SoloSuccess-purple/20 hover:border-SoloSuccess-purple/40'
};

const sizeVariants = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
  xl: 'px-12 py-6 text-xl rounded-3xl'
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
    const buttonContent = (
      <motion.button
        ref={ref}
        disabled={disabled}
        className={cn(
          'relative font-bold transition-all duration-300 ease-out',
          'focus:outline-none focus:ring-4 focus:ring-SoloSuccess-purple/30',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          buttonVariants[variant],
          sizeVariants[size],
          glow && 'shadow-lg hover:shadow-2xl',
          className
        )}
        whileHover={!disabled ? { 
          scale: 1.05, 
          y: -2,
          boxShadow: "0 10px 40px rgba(182, 33, 255, 0.4), 0 0 60px rgba(24, 255, 255, 0.3)"
        } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        animate={glow ? {
          boxShadow: [
            "0 4px 15px rgba(182, 33, 255, 0.3)",
            "0 8px 30px rgba(24, 255, 255, 0.4)",
            "0 4px 15px rgba(255, 31, 175, 0.3)"
          ]
        } : {}}
        transition={{
          boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          scale: { type: "spring", stiffness: 400, damping: 17 }
        }}
        {...props}
      >
        {shine && (
          <GlassShine 
            direction="horizontal" 
            speed={2.5}
            className="absolute inset-0 rounded-inherit"
          />
        )}
        
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>

        {sparkles && (
          <SparkleAnimation 
            intensity="medium" 
            size="small" 
            color="rainbow"
            className="absolute inset-0"
          />
        )}

        {/* Holographic border effect */}
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-SoloSuccess-purple via-SoloSuccess-cyan to-SoloSuccess-pink opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
      </motion.button>
    );

    return buttonContent;
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
        glow && 'glow-pulse',
        interactive && 'hover-lift cursor-pointer',
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
        <GlassShine 
          direction="diagonal" 
          speed={3}
          className="absolute inset-0 rounded-2xl"
        />
      )}
      
      <div className="relative z-10">
        {children}
      </div>

      {sparkles && (
        <SparkleAnimation 
          intensity="low" 
          size="small" 
          color="rainbow"
          className="absolute inset-0"
        />
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
          <GlassShine 
            direction="horizontal" 
            speed={2}
            className="absolute inset-0 rounded-xl opacity-0 focus-within:opacity-100 transition-opacity duration-300"
          />
        )}

        {sparkles && (
          <SparkleAnimation 
            intensity="low" 
            size="small" 
            color="purple"
            className="absolute inset-0 opacity-0 focus-within:opacity-100 transition-opacity duration-300"
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
        'gradient-text',
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
