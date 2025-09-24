'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SparkleAnimationProps {
  children: ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  size?: 'small' | 'medium' | 'large';
  color?: 'purple' | 'cyan' | 'pink' | 'rainbow';
  className?: string;
}

const sparkleVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0,
    rotate: 0
  },
  visible: { 
    opacity: [0, 1, 0],
    scale: [0, 1.2, 0],
    rotate: [0, 180, 360],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const colorMap = {
  purple: '#B621FF',
  cyan: '#18FFFF',
  pink: '#FF1FAF',
  rainbow: 'url(#rainbow-gradient)'
};

const sizeMap = {
  small: 4,
  medium: 8,
  large: 12
};

export function SparkleAnimation({ 
  children, 
  intensity = 'medium',
  size = 'medium',
  color = 'rainbow',
  className = ''
}: SparkleAnimationProps) {
  const sparkleCount = intensity === 'low' ? 3 : intensity === 'medium' ? 6 : 12;
  const sparkleSize = sizeMap[size];
  const sparkleColor = colorMap[color];

  const generateSparkles = () => {
    const sparkles = [];
    for (let i = 0; i < sparkleCount; i++) {
      sparkles.push(
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: sparkleSize,
            height: sparkleSize,
          }}
          variants={sparkleVariants}
          initial="hidden"
          animate="visible"
          transition={{
            delay: Math.random() * 2,
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {color === 'rainbow' ? (
            <div 
              className="w-full h-full rounded-full animate-rainbow-rotate"
              style={{
                background: 'conic-gradient(from 0deg, #B621FF, #18FFFF, #FF1FAF, #18FFFF, #B621FF)',
                filter: 'blur(0.5px)'
              }}
            />
          ) : (
            <div 
              className="w-full h-full rounded-full"
              style={{
                backgroundColor: sparkleColor,
                boxShadow: `0 0 ${sparkleSize * 2}px ${sparkleColor}`,
                filter: 'blur(0.5px)'
              }}
            />
          )}
        </motion.div>
      );
    }
    return sparkles;
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {children}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {generateSparkles()}
      </div>
      {color === 'rainbow' && (
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B621FF" />
              <stop offset="33%" stopColor="#18FFFF" />
              <stop offset="66%" stopColor="#FF1FAF" />
              <stop offset="100%" stopColor="#B621FF" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </div>
  );
}

interface GlassShineProps {
  children: ReactNode;
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  speed?: number;
  className?: string;
}

export function GlassShine({ 
  children, 
  direction = 'horizontal',
  speed = 2.5,
  className = ''
}: GlassShineProps) {
  const shineVariants = {
    hidden: {
      x: direction === 'horizontal' ? '-100%' : direction === 'vertical' ? '0%' : '-100%',
      y: direction === 'vertical' ? '-100%' : direction === 'diagonal' ? '-100%' : '0%',
      rotate: direction === 'diagonal' ? 45 : 0
    },
    visible: {
      x: direction === 'horizontal' ? '200%' : direction === 'vertical' ? '0%' : '200%',
      y: direction === 'vertical' ? '200%' : direction === 'diagonal' ? '200%' : '0%',
      rotate: direction === 'diagonal' ? 45 : 0,
      transition: {
        duration: speed,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        variants={shineVariants}
        initial="hidden"
        animate="visible"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
}

interface HolographicOverlayProps {
  children: ReactNode;
  intensity?: 'subtle' | 'medium' | 'bold';
  className?: string;
}

export function HolographicOverlay({ 
  children, 
  intensity = 'medium',
  className = ''
}: HolographicOverlayProps) {
  const overlayIntensity = {
    subtle: 'rgba(182, 33, 255, 0.05)',
    medium: 'rgba(182, 33, 255, 0.1)',
    bold: 'rgba(182, 33, 255, 0.2)'
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${overlayIntensity[intensity]} 0%, rgba(24, 255, 255, 0.1) 50%, rgba(255, 31, 175, 0.1) 100%)`,
          backgroundSize: '200% 200%'
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 0%', '100% 100%', '0% 100%', '0% 0%']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

interface GlitterEffectProps {
  children: ReactNode;
  density?: 'low' | 'medium' | 'high';
  className?: string;
}

export function GlitterEffect({ 
  children, 
  density = 'medium',
  className = ''
}: GlitterEffectProps) {
  const particleCount = density === 'low' ? 8 : density === 'medium' ? 15 : 25;

  const generateParticles = () => {
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 2 + Math.random() * 4,
            height: 2 + Math.random() * 4,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
            rotate: [0, 180, 360],
            x: [0, (Math.random() - 0.5) * 20],
            y: [0, (Math.random() - 0.5) * 20]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: `conic-gradient(from ${Math.random() * 360}deg, #B621FF, #18FFFF, #FF1FAF, #18FFFF, #B621FF)`,
              filter: 'blur(0.5px)'
            }}
          />
        </motion.div>
      );
    }
    return particles;
  };

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {generateParticles()}
      </div>
    </div>
  );
}
