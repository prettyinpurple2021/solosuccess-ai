'use client';

export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Shield, 
  Star, 
  Zap, 
  Target, 
  Users, 
  TrendingUp, 
  Brain,
  ArrowRight,
  CheckCircle,
  Crown,
  Trophy,
  Infinity
} from 'lucide-react';
import { TacticalButton } from '@/components/military/TacticalButton';
import { TacticalLink } from '@/components/military/TacticalLink';
import { GlassCard } from '@/components/military/GlassCard';
import { RankStars } from '@/components/military/RankStars';
import { CamoBackground } from '@/components/military/CamoBackground';
import { SergeantDivider } from '@/components/military/SergeantDivider';
import { StatsBadge } from '@/components/military/StatsBadge';
import { TacticalGrid, TacticalGridItem } from '@/components/military/TacticalGrid';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-military-midnight relative overflow-hidden">
      <CamoBackground opacity={0.15} withGrid>
        {/* Tactical Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel-strong border-b border-military-hot-pink/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center shadow-lg">
                  <Image
                    src="/images/solosuccess-logo.png"
                    alt="SoloSuccess AI"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="text-3xl font-heading font-bold gradient-text">
                  SOLOSUCCESS
                </div>
              </motion.div>
              
              <div className="flex items-center gap-6">
                <nav className="hidden md:flex items-center gap-8">
                  {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
                    <Link 
                      key={item}
                      href={`/${item.toLowerCase()}`}
                      className="text-sm font-tactical text-military-glass-white/90 hover:text-military-hot-pink transition-all duration-300 relative group"
                    >
                      {item.toUpperCase()}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-military-hot-pink to-military-blush-pink group-hover:w-full transition-all duration-300" />
                    </Link>
                  ))}
                </nav>
                
                <TacticalLink href="/signup" variant="primary" withShine>
                  <Shield className="w-4 h-4" />
                  Deploy Now
                  <ArrowRight className="w-4 h-4" />
                </TacticalLink>
              </div>
            </div>
          </div>
        </nav>

        {/* Command Center Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="max-w-6xl mx-auto"
            >
              {/* Tactical Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-3 stats-badge mb-8"
              >
                <Shield className="w-5 h-5 text-military-hot-pink" />
                <span className="text-tactical">Mission-Critical AI Operations</span>
                <RankStars count={5} size="sm" />
              </motion.div>

              {/* Command Heading */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-hero mb-8"
              >
                <span className="gradient-text">
                  YOUR AI CO-FOUNDER
                </span>
                <br />
                <span className="text-4xl md:text-6xl lg:text-7xl text-military-glass-white">
                  READY FOR DEPLOYMENT 🪖
                </span>
              </motion.h1>

              {/* Mission Brief */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl text-military-storm-grey leading-relaxed mb-12 max-w-4xl mx-auto font-body"
              >
                Transform your solo operation into a tactical powerhouse with AI agents deployed 24/7. 
                <span className="gradient-text font-semibold"> Automate your empire, dominate your sector,</span> 
                and execute with military precision.
              </motion.p>

              {/* Tactical CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
              >
                <TacticalLink href="/signup" variant="primary" size="lg" withShine withPulse>
                  <Zap className="w-5 h-5" />
                  Launch Mission
                  <ArrowRight className="w-5 h-5" />
                </TacticalLink>
                
                <TacticalLink href="/pricing" variant="ghost" size="lg">
                  <Target className="w-5 h-5" />
                  View Arsenal
                </TacticalLink>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              >
                {[
                  { icon: <Users />, label: 'Operators', value: '10,000+' },
                  { icon: <Trophy />, label: 'Missions Complete', value: '500K+' },
                  { icon: <Infinity />, label: 'Uptime', value: '99.9%' }
                ].map((stat, index) => (
                  <GlassCard key={index} variant="tactical" withShine className="p-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-military-hot-pink/20 flex items-center justify-center text-military-hot-pink">
                        {stat.icon}
                      </div>
                      <div className="text-3xl font-heading font-bold gradient-text">{stat.value}</div>
                      <div className="text-sm font-tactical text-military-storm-grey">{stat.label}</div>
                    </div>
                  </GlassCard>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        <SergeantDivider />

        {/* Features Section - Tactical Grid */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-heading-1 gradient-text mb-4">TACTICAL CAPABILITIES</h2>
              <p className="text-lg text-military-storm-grey max-w-2xl mx-auto">
                Deploy AI agents with military precision to dominate every aspect of your operation
              </p>
            </div>

            <TacticalGrid columns={12} gap={24}>
              {[
                {
                  icon: <Brain />,
                  title: 'AI Command Center',
                  description: '8 specialized agents ready for deployment',
                  rank: 5
                },
                {
                  icon: <Shield />,
                  title: 'Fortress Security',
                  description: 'Military-grade encryption & compliance',
                  rank: 5
                },
                {
                  icon: <Zap />,
                  title: 'Rapid Deployment',
                  description: 'Launch operations in under 60 seconds',
                  rank: 4
                },
                {
                  icon: <Target />,
                  title: 'Precision Targeting',
                  description: 'Hit business objectives with accuracy',
                  rank: 4
                },
                {
                  icon: <TrendingUp />,
                  title: 'Strategic Intel',
                  description: 'Real-time market intelligence & analytics',
                  rank: 5
                },
                {
                  icon: <Crown />,
                  title: 'Empire Building',
                  description: 'Scale from solo to squadron seamlessly',
                  rank: 5
                }
              ].map((feature, index) => (
                <TacticalGridItem key={index} span={4} className="max-md:col-span-12">
                  <GlassCard variant="default" withChevron withShine interactive className="p-8 h-full">
                    <div className="flex flex-col gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-military-hot-pink/20 to-military-blush-pink/20 border-2 border-military-hot-pink/30 flex items-center justify-center text-military-hot-pink">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-heading-2 text-military-glass-white mb-2">{feature.title}</h3>
                        <p className="text-military-storm-grey">{feature.description}</p>
                      </div>
                      <RankStars count={feature.rank} />
                    </div>
                  </GlassCard>
                </TacticalGridItem>
              ))}
            </TacticalGrid>
          </div>
        </section>

        <SergeantDivider />

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <GlassCard variant="strong" className="p-12 text-center max-w-4xl mx-auto">
              <h2 className="text-heading-1 gradient-text mb-6">READY TO COMMAND YOUR EMPIRE?</h2>
              <p className="text-xl text-military-storm-grey mb-8 max-w-2xl mx-auto">
                Join thousands of solo operators who have transformed their businesses into tactical powerhouses
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <TacticalLink href="/signup" variant="primary" size="xl" withShine>
                  <Shield className="w-6 h-6" />
                  Begin Deployment
                  <ArrowRight className="w-6 h-6" />
                </TacticalLink>
                <StatsBadge icon={<CheckCircle className="w-4 h-4" />} label="No Credit Card" value="Required" />
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-military-gunmetal/30 py-12 glass-overlay-tactical">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-6 h-6 text-military-hot-pink" />
                  <span className="font-heading font-bold gradient-text">SOLOSUCCESS</span>
                </div>
                <p className="text-sm text-military-storm-grey">
                  Military-grade AI for solo operators building empires
                </p>
              </div>
              {[
                { title: 'Product', links: ['Features', 'Pricing', 'AI Agents', 'Integrations'] },
                { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
                { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Compliance'] }
              ].map((section, i) => (
                <div key={i}>
                  <h3 className="font-tactical text-military-glass-white mb-4">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link}>
                        <Link href={`/${link.toLowerCase()}`} className="text-sm text-military-storm-grey hover:text-military-hot-pink transition-colors">
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <SergeantDivider opacity={0.3} />
            <div className="text-center text-sm text-military-storm-grey">
              <p>© 2025 SoloSuccess AI. All rights reserved. 🪖 Command Your Empire.</p>
            </div>
          </div>
        </footer>
      </CamoBackground>
    </div>
  );
}

