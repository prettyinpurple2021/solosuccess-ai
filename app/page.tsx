'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Suspense } from 'react';
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
      {/* Main Content Container */}
      <div className="relative z-10">
      {/* Epic Dark Holographic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent" />
      </div>
      
      {/* Background Glitter Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <div className="w-full h-full bg-gradient-to-r from-purple-500/5 via-cyan-500/5 to-pink-500/5" />
      </div>
      
      {/* Floating holographic orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-pink-500/8 to-cyan-500/8 rounded-full blur-3xl" />
      </div>

      {/* Holographic Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-purple-500/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                SoloSuccess
              </div>
            </motion.div>
            
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-8">
                {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
                  <Link 
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-medium text-white/90 hover:text-purple-400 transition-all duration-300 relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
                  </Link>
                ))}
              </nav>
              
              <Link href="/signup">
                <button className="bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 hover:from-purple-600 hover:via-cyan-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-purple-500/25">
                  <Sparkle className="w-4 h-4" />
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Epic Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden z-10">

        <div className="container mx-auto px-4 text-center relative z-20">
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-purple-500/30 mb-8 shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">AI-Powered Business Revolution</span>
              <Gem className="w-5 h-5 text-pink-400" />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            >
              <div className="relative">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent relative z-10 animate-pulse">
                  Your AI Co-founder
                </span>
                <br />
                <span className="text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent relative z-10">
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
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold"> Automate everything, achieve more,</span> 
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
                <motion.button 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.99 }}
                  className="bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 hover:from-purple-600 hover:via-cyan-600 hover:to-pink-600 text-white px-12 py-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 shadow-2xl hover:shadow-purple-500/50 relative overflow-hidden"
                >
                  <Rocket className="w-6 h-6" />
                  Start Your Empire
                  <Crown className="w-6 h-6" />
                  {/* Glass shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                </motion.button>
              </Link>
              
              <Link href="/auth-example">
                <motion.button 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.99 }}
                  className="bg-white/10 backdrop-blur-xl border-2 border-purple-500/50 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-purple-500/25"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </motion.button>
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
                  color: 'text-purple-400'
                },
                { 
                  number: '50K+', 
                  label: 'Active Users',
                  icon: <Users className="w-8 h-8" />,
                  color: 'text-cyan-400'
                },
                { 
                  number: '$2M+', 
                  label: 'Revenue Generated',
                  icon: <Trophy className="w-8 h-8" />,
                  color: 'text-pink-400'
                }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl text-center relative overflow-hidden border border-white/20 shadow-lg hover:shadow-purple-500/25"
                >
                  <div className={`${stat.color} mb-4 flex justify-center text-4xl`}>
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{stat.number}</div>
                  <div className="text-sm text-white/90 font-medium">{stat.label}</div>
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
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
              <Lightbulb className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">Powerful Features</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent text-5xl md:text-6xl">Supercharge Your Success</span>
            </h2>
            
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Our AI-powered platform gives you everything you need to dominate your market and achieve 
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold"> unprecedented growth</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-10 h-10" />,
                title: 'AI Co-founder',
                description: 'Your intelligent business partner that thinks strategically, plans ahead, and executes flawlessly. Never work alone again.',
                color: 'from-purple-400 to-purple-300'
              },
              {
                icon: <Zap className="w-10 h-10" />,
                title: 'Lightning Automation',
                description: 'Automate workflows and streamline operations with AI-powered tools that work at the speed of thought.',
                color: 'from-cyan-400 to-cyan-300'
              },
              {
                icon: <Target className="w-10 h-10" />,
                title: 'Strategic Planning',
                description: 'Make data-driven decisions with AI insights that help you focus on what matters most for explosive growth.',
                color: 'from-pink-400 to-pink-300'
              },
              {
                icon: <Users className="w-10 h-10" />,
                title: 'Virtual Dream Team',
                description: 'Get the power of a full team without the overhead. AI assistants handle marketing, sales, and operations 24/7.',
                color: 'from-purple-300 to-purple-400'
              },
              {
                icon: <TrendingUp className="w-10 h-10" />,
                title: 'Growth Analytics',
                description: 'Track your progress with beautiful, holographic dashboards that show exactly where your empire is heading.',
                color: 'from-cyan-300 to-cyan-400'
              },
              {
                icon: <Shield className="w-10 h-10" />,
                title: 'Enterprise Security',
                description: 'Bank-level security with 99.9% uptime. Your business data is always safe, secure, and accessible.',
                color: 'from-pink-300 to-pink-400'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <motion.div
                  className="bg-white/10 backdrop-blur-xl text-center p-8 h-full relative overflow-hidden border border-white/20 shadow-lg hover:shadow-purple-500/25 rounded-2xl"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`mb-6 flex justify-center bg-gradient-to-r ${feature.color} bg-clip-text text-transparent text-4xl`}
                  >
                    {feature.icon}
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-2xl">{feature.title}</span>
                  </h3>
                  
                  <p className="text-white/85 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Feature glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
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
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-xl max-w-6xl mx-auto p-16 text-center relative overflow-hidden border border-white/20 shadow-2xl rounded-2xl"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-pink-500/10" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-500/20 border border-purple-500/30 mb-8"
                >
                  <Crown className="w-6 h-6 text-purple-400" />
                  <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Ready to Rule Your Industry?</span>
                  <Gem className="w-6 h-6 text-pink-400" />
                </motion.div>

                <h2 className="text-5xl md:text-6xl font-bold mb-8">
                  <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent text-5xl md:text-6xl">Become a SoloSuccess</span>
                </h2>
                
                <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Join the revolution of AI-powered entrepreneurs. Start for free today and experience the future of 
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold"> unstoppable productivity</span>.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                  <Link href="/signup">
                    <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.99 }}
                      className="bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 hover:from-purple-600 hover:via-cyan-600 hover:to-pink-600 text-white px-16 py-8 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center gap-3 shadow-2xl hover:shadow-purple-500/50 relative overflow-hidden"
                    >
                      <Infinity className="w-8 h-8" />
                      Start for Free
                      <Rocket className="w-8 h-8" />
                      {/* Glass shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                    </motion.button>
                  </Link>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 text-lg text-white/80"
                  >
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    No credit card required
                    <Sparkle className="w-5 h-5 text-purple-400" />
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Holographic Footer */}
      <footer className="py-16 border-t border-purple-500/20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <motion.div 
                className="flex items-center gap-3 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                  <Crown className="w-7 h-7 text-white" />
                </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                SoloSuccess
              </div>
              </motion.div>
              <p className="text-white/80 leading-relaxed">
                Empowering entrepreneurs with AI-powered productivity tools that transform solo businesses into unstoppable empires.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-bold text-lg mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Product</h3>
              <ul className="space-y-4">
                {['Features', 'Pricing', 'API', 'Integrations'].map((item) => (
                  <li key={item}>
                    <Link 
                      href={`#${item.toLowerCase()}`}
                      className="text-white/85 hover:text-purple-400 transition-all duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-bold text-lg mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Company</h3>
              <ul className="space-y-4">
                {['About', 'Blog', 'Contact', 'Careers'].map((item) => (
                  <li key={item}>
                    <Link 
                      href={`/${item.toLowerCase()}`}
                      className="text-white/85 hover:text-purple-400 transition-all duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-bold text-lg mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Support</h3>
              <ul className="space-y-4">
                {['Help Center', 'Documentation', 'Community', 'Status'].map((item) => (
                  <li key={item}>
                    <Link 
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      className="text-white/85 hover:text-purple-400 transition-all duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-purple-500/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/75 text-sm">
                © 2024 SoloSuccess AI. All rights reserved. Made with ✨ and holographic magic.
              </p>
              <div className="flex items-center gap-6 text-sm">
                {['Privacy', 'Terms', 'Cookies'].map((item) => (
                  <Link 
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="text-white/75 hover:text-purple-400 transition-all duration-300"
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
    </div>
  );
}