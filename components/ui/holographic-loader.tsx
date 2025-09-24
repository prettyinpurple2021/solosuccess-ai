'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HolographicLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

export function HolographicLoader({ 
  size = 'md', 
  className,
  text 
}: HolographicLoaderProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <motion.div
        className={cn(
          'relative rounded-full',
          sizeMap[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-SoloSuccess-purple via-SoloSuccess-cyan to-SoloSuccess-pink bg-clip-border animate-holographic-shift" />
        
        {/* Inner spinner */}
        <div className="absolute inset-1 rounded-full border-2 border-transparent bg-gradient-to-r from-SoloSuccess-pink via-SoloSuccess-purple to-SoloSuccess-cyan bg-clip-border animate-holographic-shift" 
             style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        
        {/* Center sparkle */}
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-r from-SoloSuccess-purple to-SoloSuccess-cyan animate-pulse"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {text && (
        <motion.p
          className="text-sm text-muted-foreground font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

interface SparkleLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function SparkleLoader({ 
  size = 'md', 
  className,
  text 
}: SparkleLoaderProps) {
  const sparkleSize = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
  const containerSize = size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-12 h-12' : 'w-16 h-16';

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className={cn('relative', containerSize)}>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: sparkleSize,
              height: sparkleSize,
              left: '50%',
              top: '50%',
              transformOrigin: `${sparkleSize * 3}px 0px`,
              transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-${sparkleSize * 3}px)`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          >
            <div 
              className="w-full h-full rounded-full"
              style={{
                background: `conic-gradient(from ${i * 45}deg, #B621FF, #18FFFF, #FF1FAF, #18FFFF, #B621FF)`,
                boxShadow: `0 0 ${sparkleSize * 2}px rgba(182, 33, 255, 0.5)`
              }}
            />
          </motion.div>
        ))}
      </div>

      {text && (
        <motion.p
          className="text-sm text-muted-foreground font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

interface GlitterLoaderProps {
  className?: string;
  text?: string;
}

export function GlitterLoader({ className, text }: GlitterLoaderProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className="relative w-16 h-16">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [0, -20, 0],
              x: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          >
            <div 
              className="w-full h-full rounded-full"
              style={{
                background: `conic-gradient(from ${Math.random() * 360}deg, #B621FF, #18FFFF, #FF1FAF, #18FFFF, #B621FF)`,
                boxShadow: `0 0 4px rgba(182, 33, 255, 0.8)`
              }}
            />
          </motion.div>
        ))}
      </div>

      {text && (
        <motion.p
          className="text-sm text-muted-foreground font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

interface PulseLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function PulseLoader({ 
  size = 'md', 
  className,
  text 
}: PulseLoaderProps) {
  const pulseSize = size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-12 h-12' : 'w-16 h-16';

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className="relative">
        <motion.div
          className={cn(
            'rounded-full bg-gradient-hero',
            pulseSize
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Pulse rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              'absolute inset-0 rounded-full border-2 border-SoloSuccess-purple/30',
              pulseSize
            )}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {text && (
        <motion.p
          className="text-sm text-muted-foreground font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
