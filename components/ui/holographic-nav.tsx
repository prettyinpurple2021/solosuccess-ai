'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { HolographicButton } from './holographic-button';
import { SparkleAnimation } from './sparkle-animation';
import { GradientText } from './holographic-button';
import { cn } from '@/lib/utils';
import { Menu, X, Star, Zap } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  sparkles?: boolean;
}

interface HolographicNavProps {
  items: NavItem[];
  logo?: React.ReactNode;
  className?: string;
  mobile?: boolean;
}

export function HolographicNav({ 
  items, 
  logo, 
  className,
  mobile = false 
}: HolographicNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'holo-overlay backdrop-blur-md',
        'border-b border-SoloSuccess-purple/20',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            {logo ? (
              <SparkleAnimation intensity="low" size="small" color="rainbow">
                {logo}
              </SparkleAnimation>
            ) : (
              <GradientText className="text-xl font-bold">
                SoloSuccess
              </GradientText>
            )}
          </motion.div>

          {/* Desktop Navigation */}
          {!mobile && (
            <div className="hidden md:flex items-center gap-8">
              {items.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    'relative px-4 py-2 rounded-lg',
                    'text-foreground hover:text-SoloSuccess-purple',
                    'transition-all duration-300',
                    'hover:bg-SoloSuccess-purple/10'
                  )}
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                    {item.sparkles && (
                      <SparkleAnimation intensity="low" size="small" color="purple">
                        <Star className="w-3 h-3" />
                      </SparkleAnimation>
                    )}
                  </span>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-SoloSuccess-purple/20 via-SoloSuccess-cyan/20 to-SoloSuccess-pink/20 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
                </motion.a>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <HolographicButton
              variant="primary"
              size="sm"
              sparkles={true}
              shine={true}
              glow={true}
              className="hidden sm:inline-flex"
            >
              Get Started
              <SparkleAnimation intensity="medium" size="small" color="rainbow">
                <Zap className="w-4 h-4" />
              </SparkleAnimation>
            </HolographicButton>

            {/* Mobile Menu Button */}
            {mobile && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-SoloSuccess-purple/10 hover:bg-SoloSuccess-purple/20 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-SoloSuccess-purple" />
                ) : (
                  <Menu className="w-6 h-6 text-SoloSuccess-purple" />
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isMenuOpen ? 'auto' : 0,
              opacity: isMenuOpen ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <div className="py-4 space-y-2 border-t border-SoloSuccess-purple/20">
              {items.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: isMenuOpen ? 1 : 0, 
                    x: isMenuOpen ? 0 : -20 
                  }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-lg',
                    'text-foreground hover:text-SoloSuccess-purple',
                    'hover:bg-SoloSuccess-purple/10',
                    'transition-all duration-300'
                  )}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                    {item.sparkles && (
                      <SparkleAnimation intensity="low" size="small" color="purple">
                        <Star className="w-4 h-4" />
                      </SparkleAnimation>
                    )}
                  </span>
                </motion.a>
              ))}
              
              <div className="pt-4">
                <HolographicButton
                  variant="primary"
                  size="sm"
                  sparkles={true}
                  shine={true}
                  glow={true}
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                  <SparkleAnimation intensity="medium" size="small" color="rainbow">
                    <Zap className="w-4 h-4" />
                  </SparkleAnimation>
                </HolographicButton>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

interface HolographicFooterProps {
  logo?: React.ReactNode;
  links?: {
    title: string;
    items: { label: string; href: string; sparkles?: boolean }[];
  }[];
  socialLinks?: { label: string; href: string; icon: React.ReactNode }[];
  className?: string;
}

export function HolographicFooter({
  logo,
  links,
  socialLinks,
  className
}: HolographicFooterProps) {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        'relative mt-20',
        'holo-overlay backdrop-blur-md',
        'border-t border-SoloSuccess-purple/20',
        className
      )}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo Section */}
          <div className="md:col-span-1">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mb-4"
            >
              {logo ? (
                <SparkleAnimation intensity="low" size="medium" color="rainbow">
                  {logo}
                </SparkleAnimation>
              ) : (
                <GradientText className="text-2xl font-bold">
                  SoloSuccess
                </GradientText>
              )}
            </motion.div>
            <p className="text-muted-foreground text-sm">
              Empowering solo entrepreneurs with AI-powered tools and holographic experiences.
            </p>
          </div>

          {/* Links Sections */}
          {links?.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
            >
              <h3 className="font-semibold mb-4">
                <GradientText className="text-lg">{section.title}</GradientText>
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * itemIndex }}
                  >
                    <a
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 text-sm text-muted-foreground',
                        'hover:text-SoloSuccess-purple transition-colors duration-300'
                      )}
                    >
                      {item.label}
                      {item.sparkles && (
                        <SparkleAnimation intensity="low" size="small" color="purple">
                          <Star className="w-3 h-3" />
                        </SparkleAnimation>
                      )}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Social Links */}
          {socialLinks && (
            <div>
              <h3 className="font-semibold mb-4">
                <GradientText className="text-lg">Connect</GradientText>
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.href}
                    href={social.href}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'p-3 rounded-xl',
                      'bg-SoloSuccess-purple/10 hover:bg-SoloSuccess-purple/20',
                      'text-SoloSuccess-purple transition-all duration-300',
                      'border border-SoloSuccess-purple/20 hover:border-SoloSuccess-purple/40'
                    )}
                  >
                    <SparkleAnimation intensity="low" size="small" color="purple">
                      {social.icon}
                    </SparkleAnimation>
                  </motion.a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 pt-8 border-t border-SoloSuccess-purple/20 text-center"
        >
          <p className="text-sm text-muted-foreground">
            © 2024 SoloSuccess AI. All rights reserved. Made with{' '}
            <SparkleAnimation intensity="medium" size="small" color="pink">
              <span className="text-SoloSuccess-pink">✨</span>
            </SparkleAnimation>
            {' '}and holographic magic.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
