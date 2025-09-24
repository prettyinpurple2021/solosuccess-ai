'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { HolographicCard, HolographicButton, GradientText } from './holographic-button';
import { SparkleAnimation } from './sparkle-animation';
import { cn } from '@/lib/utils';
import { Check, Star, Zap } from 'lucide-react';

interface PricingFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface HolographicPricingCardProps {
  title: string;
  description: string;
  price: {
    monthly: number;
    yearly?: number;
    currency?: string;
  };
  features: PricingFeature[];
  ctaText: string;
  onCtaClick: () => void;
  popular?: boolean;
  sparkles?: boolean;
  className?: string;
}

export function HolographicPricingCard({
  title,
  description,
  price,
  features,
  ctaText,
  onCtaClick,
  popular = false,
  sparkles = true,
  className
}: HolographicPricingCardProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        'relative',
        popular && 'scale-105 z-10',
        className
      )}
    >
      {/* Popular badge */}
      {popular && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="bg-gradient-card text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
            <Star className="w-4 h-4 fill-current" />
            Most Popular
            <SparkleAnimation intensity="high" size="small" color="rainbow">
              <Zap className="w-4 h-4" />
            </SparkleAnimation>
          </div>
        </motion.div>
      )}

      <HolographicCard
        sparkles={sparkles}
        shine={true}
        glow={true}
        interactive={true}
        className={cn(
          'h-full flex flex-col',
          popular && 'border-2 border-SoloSuccess-purple/30 shadow-2xl'
        )}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">
            <GradientText className="text-2xl">{title}</GradientText>
          </h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold">
              <GradientText className="text-4xl">
                {price.currency || '$'}{price.monthly}
              </GradientText>
            </span>
            <span className="text-muted-foreground">/month</span>
          </div>
          {price.yearly && (
            <p className="text-sm text-muted-foreground mt-1">
              Save ${((price.monthly * 12) - price.yearly)} annually
            </p>
          )}
        </div>

        {/* Features */}
        <div className="flex-1 mb-6">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={cn(
                  'flex items-start gap-3',
                  !feature.included && 'opacity-50',
                  feature.highlight && 'font-semibold text-SoloSuccess-purple'
                )}
              >
                <div className={cn(
                  'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5',
                  feature.included 
                    ? 'bg-gradient-SoloSuccess text-white' 
                    : 'bg-gray-200 text-gray-400'
                )}>
                  {feature.included && (
                    <Check className="w-3 h-3" />
                  )}
                </div>
                <span className="text-sm">{feature.text}</span>
                {feature.highlight && (
                  <SparkleAnimation intensity="low" size="small" color="purple">
                    <Star className="w-3 h-3 fill-current text-SoloSuccess-purple" />
                  </SparkleAnimation>
                )}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <HolographicButton
            onClick={onCtaClick}
            variant={popular ? 'primary' : 'secondary'}
            size="lg"
            className="w-full"
            sparkles={true}
            shine={true}
            glow={true}
          >
            {ctaText}
            {popular && (
              <SparkleAnimation intensity="medium" size="small" color="rainbow">
                <Zap className="w-4 h-4" />
              </SparkleAnimation>
            )}
          </HolographicButton>
        </motion.div>

        {/* Extra sparkles for popular cards */}
        {popular && (
          <div className="absolute top-4 right-4">
            <SparkleAnimation intensity="high" size="medium" color="rainbow">
              <Star className="w-6 h-6 fill-current text-yellow-400" />
            </SparkleAnimation>
          </div>
        )}
      </HolographicCard>
    </motion.div>
  );
}

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  sparkles?: boolean;
  className?: string;
}

export function HolographicInfoCard({
  icon,
  title,
  description,
  sparkles = true,
  className
}: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <HolographicCard
        sparkles={sparkles}
        shine={true}
        glow={false}
        interactive={true}
        className={cn('text-center', className)}
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="mb-4 flex justify-center"
        >
          {sparkles ? (
            <SparkleAnimation intensity="medium" size="medium" color="rainbow">
              <div className="text-4xl">{icon}</div>
            </SparkleAnimation>
          ) : (
            <div className="text-4xl">{icon}</div>
          )}
        </motion.div>

        <h3 className="text-xl font-bold mb-2">
          <GradientText className="text-xl">{title}</GradientText>
        </h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </HolographicCard>
    </motion.div>
  );
}

interface HeroHeaderProps {
  title: string;
  subtitle: string;
  sparkles?: boolean;
  className?: string;
}

export function HolographicHeroHeader({
  title,
  subtitle,
  sparkles = true,
  className
}: HeroHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn('text-center max-w-4xl mx-auto', className)}
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
      >
        {sparkles ? (
          <SparkleAnimation intensity="high" size="large" color="rainbow">
            <GradientText className="text-4xl md:text-6xl lg:text-7xl">
              {title}
            </GradientText>
          </SparkleAnimation>
        ) : (
          <GradientText className="text-4xl md:text-6xl lg:text-7xl">
            {title}
          </GradientText>
        )}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-lg md:text-xl text-muted-foreground leading-relaxed"
      >
        {subtitle}
      </motion.p>
    </motion.div>
  );
}
