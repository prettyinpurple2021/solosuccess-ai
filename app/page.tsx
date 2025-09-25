'use client';

import { motion } from 'framer-motion';
import { HolographicButton, HolographicCard, GradientText } from '@/components/ui/holographic-button';
import { SparkleAnimation, HolographicGlitter, GlitterEffect } from '@/components/ui/sparkle-animation';
import Link from 'next/link';
import { 
  Zap, 
  Star, 
  Rocket, 
  Target, 
  Users, 
  TrendingUp, 
  Shield, 
  Brain,
  ArrowRight,
  Play,
  CheckCircle,
  Sparkles,
  Crown,
  Gem,
  Wand2,
  Sparkle,
  Lightbulb,
  Trophy,
  Infinity
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Epic Dark Holographic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-SoloSuccess-purple/10 via-transparent to-SoloSuccess-cyan/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-SoloSuccess-pink/5 to-transparent" />
      </div>
      
      {/* Background Glitter Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <GlitterEffect className="w-full h-full opacity-50" />
      </div>
      
      {/* Floating holographic orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-SoloSuccess-purple/20 to-SoloSuccess-pink/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-SoloSuccess-cyan/20 to-SoloSuccess-purple/20 rounded-full blur-3xl animate-pulse-soft animation-delay-1s" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-SoloSuccess-pink/15 to-SoloSuccess-cyan/15 rounded-full blur-3xl animate-pulse-soft animation-delay-2s" />
      </div>

      {/* Holographic Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 holo-overlay backdrop-blur-xl border-b border-SoloSuccess-purple/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-boss gradient-text">
                SoloSuccess
              </div>
            </motion.div>
            
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-8">
                {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
                  <Link 
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-medium hover:gradient-text transition-all duration-300 relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-SoloSuccess-purple to-SoloSuccess-pink group-hover:w-full transition-all duration-300" />
                  </Link>
                ))}
              </nav>
              
              <Link href="/signup">
                <HolographicButton
                  variant="primary"
                  size="md"
                  sparkles={true}
                  shine={true}
                  glow={true}
                  className="relative"
                >
                  <Sparkle className="w-4 h-4" />
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </HolographicButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Epic Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-6xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full holo-overlay border border-SoloSuccess-purple/30 mb-8"
            >
              <Sparkles className="w-5 h-5 text-SoloSuccess-purple" />
              <span className="text-sm font-medium gradient-text">AI-Powered Business Revolution</span>
              <Gem className="w-5 h-5 text-SoloSuccess-pink" />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-boss mb-8 leading-tight"
            >
              <div className="relative">
                <HolographicGlitter density="heavy" className="absolute inset-0" />
                <span className="gradient-text relative z-10">
                  Your AI Co-founder
                </span>
                <br />
                <span className="text-4xl md:text-6xl lg:text-7xl gradient-text relative z-10">
                  Awaits ✨
                </span>
              </div>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/90 leading-relaxed mb-12 max-w-4xl mx-auto"
            >
              Transform your solo business into a powerhouse with AI agents that work 24/7. 
              <span className="gradient-text font-semibold"> Automate everything, achieve more,</span> 
              and dominate your industry like never before.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Link href="/signup">
                <HolographicButton 
                  size="xl" 
                  variant="primary"
                  sparkles={true}
                  shine={true}
                  glow={true}
                  className="text-lg px-12 py-6 font-boss"
                >
                  <Rocket className="w-6 h-6" />
                  Start Your Empire
                  <Crown className="w-6 h-6" />
                </HolographicButton>
              </Link>
              
              <Link href="/auth-example">
                <HolographicButton 
                  size="lg" 
                  variant="ghost"
                  sparkles={true}
                  shine={true}
                  className="text-lg px-10 py-4"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </HolographicButton>
              </Link>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {[
                { 
                  number: '300%', 
                  label: 'Productivity Increase',
                  icon: <TrendingUp className="w-8 h-8" />,
                  color: 'text-SoloSuccess-purple'
                },
                { 
                  number: '50K+', 
                  label: 'Active Users',
                  icon: <Users className="w-8 h-8" />,
                  color: 'text-SoloSuccess-cyan'
                },
                { 
                  number: '$2M+', 
                  label: 'Revenue Generated',
                  icon: <Trophy className="w-8 h-8" />,
                  color: 'text-SoloSuccess-pink'
                }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="holo-overlay p-8 rounded-2xl text-center relative overflow-hidden"
                >
                  <div className={`${stat.color} mb-4 flex justify-center`}>
                    <HolographicGlitter density="medium">
                      {stat.icon}
                    </HolographicGlitter>
                  </div>
                  <div className="text-4xl font-boss mb-2 gradient-text">{stat.number}</div>
                  <div className="text-sm text-white/80 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-SoloSuccess-purple/10 border border-SoloSuccess-purple/30 mb-6">
              <Lightbulb className="w-5 h-5 text-SoloSuccess-purple" />
              <span className="text-sm font-medium text-SoloSuccess-purple">Powerful Features</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-boss mb-8">
              <HolographicGlitter density="heavy">
                <GradientText className="text-5xl md:text-6xl">Supercharge Your Success</GradientText>
              </HolographicGlitter>
            </h2>
            
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Our AI-powered platform gives you everything you need to dominate your market and achieve 
              <span className="gradient-text font-semibold"> unprecedented growth</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-10 h-10" />,
                title: 'AI Co-founder',
                description: 'Your intelligent business partner that thinks strategically, plans ahead, and executes flawlessly. Never work alone again.',
                color: 'from-SoloSuccess-purple to-SoloSuccess-purple-light'
              },
              {
                icon: <Zap className="w-10 h-10" />,
                title: 'Lightning Automation',
                description: 'Automate workflows and streamline operations with AI-powered tools that work at the speed of thought.',
                color: 'from-SoloSuccess-cyan to-SoloSuccess-cyan-light'
              },
              {
                icon: <Target className="w-10 h-10" />,
                title: 'Strategic Planning',
                description: 'Make data-driven decisions with AI insights that help you focus on what matters most for explosive growth.',
                color: 'from-SoloSuccess-pink to-SoloSuccess-pink-light'
              },
              {
                icon: <Users className="w-10 h-10" />,
                title: 'Virtual Dream Team',
                description: 'Get the power of a full team without the overhead. AI assistants handle marketing, sales, and operations 24/7.',
                color: 'from-SoloSuccess-purple-light to-SoloSuccess-purple'
              },
              {
                icon: <TrendingUp className="w-10 h-10" />,
                title: 'Growth Analytics',
                description: 'Track your progress with beautiful, holographic dashboards that show exactly where your empire is heading.',
                color: 'from-SoloSuccess-cyan-light to-SoloSuccess-cyan'
              },
              {
                icon: <Shield className="w-10 h-10" />,
                title: 'Enterprise Security',
                description: 'Bank-level security with 99.9% uptime. Your business data is always safe, secure, and accessible.',
                color: 'from-SoloSuccess-pink-light to-SoloSuccess-pink'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <HolographicCard
                  sparkles={true}
                  shine={true}
                  glow={true}
                  interactive={true}
                  className="text-center p-8 h-full relative overflow-hidden"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`mb-6 flex justify-center bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}
                  >
                    <HolographicGlitter density="heavy">
                      {feature.icon}
                    </HolographicGlitter>
                  </motion.div>

                  <h3 className="text-2xl font-boss mb-4">
                    <GradientText className="text-2xl">{feature.title}</GradientText>
                  </h3>
                  
                  <p className="text-white/80 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Feature glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                </HolographicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <HolographicCard
              sparkles={true}
              shine={true}
              glow={true}
              className="max-w-6xl mx-auto p-16 text-center relative overflow-hidden"
            >
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-SoloSuccess-purple/10 via-SoloSuccess-cyan/10 to-SoloSuccess-pink/10" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-SoloSuccess-purple/20 to-SoloSuccess-pink/20 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-SoloSuccess-purple/20 border border-SoloSuccess-purple/30 mb-8"
                >
                  <Crown className="w-6 h-6 text-SoloSuccess-purple" />
                  <span className="text-sm font-medium gradient-text">Ready to Rule Your Industry?</span>
                  <Gem className="w-6 h-6 text-SoloSuccess-pink" />
                </motion.div>

                <h2 className="text-5xl md:text-6xl font-boss mb-8">
                  <HolographicGlitter density="heavy">
                    <GradientText className="text-5xl md:text-6xl">Become a SoloSuccess</GradientText>
                  </HolographicGlitter>
                </h2>
                
                <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Join the revolution of AI-powered entrepreneurs. Start for free today and experience the future of 
                  <span className="gradient-text font-semibold"> unstoppable productivity</span>.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                  <Link href="/signup">
                    <HolographicButton
                      variant="primary"
                      size="xl"
                      sparkles={true}
                      shine={true}
                      glow={true}
                      className="text-xl px-16 py-8 font-boss"
                    >
                      <Infinity className="w-8 h-8" />
                      Start for Free
                      <Rocket className="w-8 h-8" />
                    </HolographicButton>
                  </Link>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 text-lg text-white/80"
                  >
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    No credit card required
                    <Sparkle className="w-5 h-5 text-SoloSuccess-purple" />
                  </motion.div>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>Enterprise Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span>99.9% Uptime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>50K+ Users</span>
                  </div>
                </div>
              </div>
            </HolographicCard>
          </motion.div>
        </div>
      </section>

      {/* Holographic Footer */}
      <footer className="py-16 border-t border-SoloSuccess-purple/20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <motion.div 
                className="flex items-center gap-3 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-boss gradient-text">
                  SoloSuccess
                </div>
              </motion.div>
              <p className="text-white/80 leading-relaxed">
                Empowering entrepreneurs with AI-powered productivity tools that transform solo businesses into unstoppable empires.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-boss text-lg mb-6 gradient-text">Product</h3>
              <ul className="space-y-4">
                {['Features', 'Pricing', 'API', 'Integrations'].map((item) => (
                  <li key={item}>
                    <Link 
                      href={`#${item.toLowerCase()}`}
                      className="text-white/70 hover:gradient-text transition-all duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-boss text-lg mb-6 gradient-text">Company</h3>
              <ul className="space-y-4">
                {['About', 'Blog', 'Contact', 'Careers'].map((item) => (
                  <li key={item}>
                    <Link 
                      href={`/${item.toLowerCase()}`}
                      className="text-white/70 hover:gradient-text transition-all duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-boss text-lg mb-6 gradient-text">Support</h3>
              <ul className="space-y-4">
                {['Help Center', 'Documentation', 'Community', 'Status'].map((item) => (
                  <li key={item}>
                    <Link 
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      className="text-white/70 hover:gradient-text transition-all duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-SoloSuccess-purple/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/60 text-sm">
                © 2024 SoloSuccess AI. All rights reserved. Made with ✨ and holographic magic.
              </p>
              <div className="flex items-center gap-6 text-sm">
                {['Privacy', 'Terms', 'Cookies'].map((item) => (
                  <Link 
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="text-white/60 hover:gradient-text transition-all duration-300"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}