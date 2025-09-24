'use client';

import { motion } from 'framer-motion';
import { HolographicButton, HolographicCard, GradientText } from '@/components/ui/holographic-button';
import { SparkleAnimation, HolographicGlitter } from '@/components/ui/sparkle-animation';
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
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-SoloSuccess-purple/5 via-SoloSuccess-cyan/5 to-SoloSuccess-pink/5">
      {/* Simple Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 holo-overlay backdrop-blur-md border-b border-SoloSuccess-purple/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold gradient-text">
              SoloSuccess
            </div>
            <div className="flex items-center gap-4">
              <HolographicButton
                variant="primary"
                size="sm"
                sparkles={true}
                shine={true}
                glow={true}
              >
                Get Started
                <Star className="w-4 h-4" />
              </HolographicButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              <span className="holo-overlay inline-block">
                <span className="gradient-text text-4xl md:text-6xl lg:text-7xl tracking-wider font-extrabold">
                  SoloSuccess AI
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8"
            >
              Transform your solo business into a powerhouse with AI-powered tools, strategic insights, and holographic experiences that make you unstoppable.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <HolographicButton size="xl" className="bold-btn holo-overlay">
                Get Started Now
              </HolographicButton>
              <HolographicButton size="lg" className="bold-btn holo-overlay">
                Explore Features
              </HolographicButton>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              {[
                { number: '10K+', label: 'Active Users' },
                { number: '99.9%', label: 'Uptime' },
                { number: '50%', label: 'Faster Growth' }
              ].map((stat, index) => (
                <div key={index} className="bold-card holo-overlay text-center">
                  <div className="text-3xl font-extrabold mb-2 gradient-text">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <HolographicGlitter density="medium">
                <GradientText className="text-4xl md:text-5xl">Powerful Features</GradientText>
              </HolographicGlitter>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to build, grow, and scale your solo business with AI-powered precision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'AI Co-founder',
                description: 'Your intelligent business partner that thinks strategically, plans ahead, and executes flawlessly.'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Lightning Fast',
                description: 'Automate workflows and streamline operations with AI-powered tools that work at the speed of thought.'
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Strategic Planning',
                description: 'Make data-driven decisions with AI insights that help you focus on what matters most for growth.'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Virtual Team',
                description: 'Get the power of a full team without the overhead. AI assistants handle marketing, sales, and operations.'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Growth Analytics',
                description: 'Track your progress with beautiful, holographic dashboards that show exactly where your business is heading.'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Secure & Reliable',
                description: 'Enterprise-grade security with 99.9% uptime. Your business data is always safe and accessible.'
              }
            ].map((feature, index) => (
              <HolographicCard
                key={index}
                sparkles={true}
                shine={true}
                glow={false}
                interactive={true}
                className="text-center p-6 h-full"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mb-4 flex justify-center text-SoloSuccess-purple"
                >
                  <HolographicGlitter density="medium">
                    {feature.icon}
                  </HolographicGlitter>
                </motion.div>

                <h3 className="text-xl font-bold mb-2">
                  <GradientText className="text-xl">{feature.title}</GradientText>
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </HolographicCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 text-center">
          <HolographicCard
            sparkles={true}
            shine={true}
            glow={true}
            className="max-w-4xl mx-auto p-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <GradientText className="text-4xl md:text-5xl">Ready to Transform Your Business?</GradientText>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of solo founders who've already discovered the power of AI-driven business growth.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <HolographicButton
                  variant="primary"
                  size="lg"
                  sparkles={true}
                  shine={true}
                  glow={true}
                  className="text-lg"
                >
                  Start Your Free Trial
                  <Rocket className="w-5 h-5" />
                </HolographicButton>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  No credit card required
                </motion.div>
              </div>
            </motion.div>
          </HolographicCard>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-SoloSuccess-purple/20">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-bold mb-4">
            <GradientText className="text-2xl">SoloSuccess</GradientText>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 SoloSuccess AI. All rights reserved. Made with ✨ and holographic magic.
          </p>
        </div>
      </footer>
    </div>
  );
}