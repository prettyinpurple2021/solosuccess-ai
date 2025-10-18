'use client'

import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Crown,
  Zap,
  Target,
  Shield,
  Users,
  TrendingUp,
  Star,
  Trophy,
  Clock,
  Check,
  ChevronRight,
  Rocket,
  Award
} from 'lucide-react'
import { 
  TacticalButton, 
  GlassCard, 
  RankStars, 
  CamoBackground, 
  SergeantDivider,
  StatsBadge,
  TacticalGrid,
  TacticalGridItem
} from '@/components/military'
import FaqSection from '@/components/faq/faq-section'

export const metadata: Metadata = {
  title: 'Accelerator Plan — AI Business Co-pilot for Growing Founders',
  description: 'Scale with 5 AI agents, advanced automation, and team collaboration. Perfect for growing Solo Founders, Small Business Owners, and E-commerce Entrepreneurs.',
  alternates: {
    canonical: 'https://solobossai.fun/pricing/accelerator',
  },
  openGraph: {
    title: 'Accelerator Plan — AI Business Co-pilot',
    description: 'Growth plan with Workflow Automation AI and Founder AI Tools for scaling businesses.',
    url: 'https://solobossai.fun/pricing/accelerator',
    type: 'website',
    siteName: 'SoloSuccess AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Accelerator Plan — AI Business Co-pilot',
    description: 'Scale your business with AI Business Co-pilot and advanced automation.',
  },
}

// Edge Runtime disabled due to Node.js dependency incompatibility
export const runtime = 'nodejs'

const features = [
  {
    category: "AI Agents",
    items: [
      "5 Elite AI Agents",
      "Workflow Automation AI",
      "Founder AI Tools",
      "Marketing AI Assistant",
      "Sales AI Co-pilot"
    ]
  },
  {
    category: "Automation",
    items: [
      "Advanced Workflow Automation",
      "Custom AI Training",
      "API Integrations",
      "Team Collaboration Tools",
      "Priority Support"
    ]
  },
  {
    category: "Analytics",
    items: [
      "Advanced Analytics Dashboard",
      "Performance Tracking",
      "ROI Analysis",
      "Custom Reports",
      "Real-time Insights"
    ]
  }
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "E-commerce Founder",
    content: "The Accelerator plan transformed my business operations. The AI agents handle complex workflows I never had time for.",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    role: "SaaS Founder",
    content: "Finally, AI that actually understands my business. The automation features saved me 20+ hours per week.",
    rating: 5
  },
  {
    name: "Emily Watson",
    role: "Consultant",
    content: "The team collaboration features are game-changing. My virtual team is more productive than ever.",
    rating: 5
  }
]

export default function AcceleratorPricingPage() {
  return (
    <>
      <Script
        id="stripe-pricing-accelerator"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Stripe pricing integration for Accelerator plan
            window.stripePricingConfig = {
              plan: 'accelerator',
              priceId: 'price_1S46LyPpYfwm37m7M5nOAYW7',
              features: ${JSON.stringify(features)}
            };
          `,
        }}
      />
      
      <div className="min-h-screen bg-military-midnight relative overflow-hidden">
        <CamoBackground opacity={0.1} withGrid>
          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-50 glass-panel-strong border-b border-military-hot-pink/30">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-20">
                <Link href="/" className="flex items-center gap-3">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Crown className="w-6 h-6 text-white" />
                  </motion.div>
                  <span className="font-heading text-xl font-bold text-white">SoloSuccess AI</span>
                </Link>
                
                <div className="flex items-center gap-4">
                  <Link href="/pricing">
                    <TacticalButton variant="outline" size="sm">
                      All Plans
                    </TacticalButton>
                  </Link>
                  <Link href="/signup">
                    <TacticalButton size="sm">
                      Get Started
                    </TacticalButton>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="pt-32 pb-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <div className="flex items-center justify-center gap-2 mb-6">
                  <RankStars count={5} size="lg" />
                  <span className="text-military-hot-pink font-tactical text-sm uppercase tracking-wider">
                    Elite Growth Tier
                  </span>
                </div>
                
                <h1 className="font-heading text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">
                    Accelerator
                  </span> Plan
            </h1>
                
                <p className="text-2xl text-military-storm-grey max-w-3xl mx-auto mb-8 leading-relaxed">
                  Scale your business with 5 elite AI agents, advanced automation, 
                  and team collaboration tools. Perfect for growing entrepreneurs.
                </p>
                
                <div className="flex items-center justify-center gap-4 mb-12">
                  <div className="text-6xl font-bold text-military-hot-pink">$19</div>
                  <div className="text-military-storm-grey">
                    <div className="text-2xl">/month</div>
                    <div className="text-sm">or $190/year</div>
                  </div>
                </div>
                
                <TacticalButton size="lg" className="group">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Accelerating Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </TacticalButton>
              </motion.div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="font-heading text-5xl font-bold text-white mb-6">
                  Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Features</span>
                </h2>
                <p className="text-xl text-military-storm-grey max-w-2xl mx-auto">
                  Everything you need to scale your business with military precision
                </p>
              </motion.div>

              <TacticalGrid className="max-w-6xl mx-auto">
                {features.map((category, index) => (
                  <TacticalGridItem key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <GlassCard className="h-full p-8">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                          {index === 0 && <Users className="w-8 h-8 text-white" />}
                          {index === 1 && <Zap className="w-8 h-8 text-white" />}
                          {index === 2 && <TrendingUp className="w-8 h-8 text-white" />}
                        </div>
                        
                        <h3 className="font-heading text-2xl font-bold text-white mb-6 text-center">
                          {category.category}
                        </h3>
                        
                        <div className="space-y-4">
                          {category.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                              <span className="text-military-storm-grey">{item}</span>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    </motion.div>
                  </TacticalGridItem>
                ))}
              </TacticalGrid>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="font-heading text-5xl font-bold text-white mb-6">
                  Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Testimonials</span>
                </h2>
                <p className="text-xl text-military-storm-grey max-w-2xl mx-auto">
                  Hear from successful entrepreneurs who've accelerated their growth
                </p>
              </motion.div>

              <TacticalGrid className="max-w-6xl mx-auto">
                {testimonials.map((testimonial, index) => (
                  <TacticalGridItem key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <GlassCard className="h-full p-8">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        
                        <p className="text-military-storm-grey mb-6 leading-relaxed">
                          "{testimonial.content}"
                        </p>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {testimonial.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{testimonial.name}</div>
                            <div className="text-military-storm-grey text-sm">{testimonial.role}</div>
                          </div>
                </div>
                      </GlassCard>
                    </motion.div>
                  </TacticalGridItem>
                ))}
              </TacticalGrid>
                </div>
          </div>

          {/* CTA Section */}
          <div className="py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <GlassCard className="max-w-4xl mx-auto p-12">
                  <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                    <Rocket className="w-10 h-10 text-white" />
                  </div>
                  
                  <h2 className="font-heading text-4xl font-bold text-white mb-6">
                    Ready to Accelerate Your Business?
              </h2>
                  
                  <p className="text-xl text-military-storm-grey mb-8 max-w-2xl mx-auto">
                    Join thousands of successful entrepreneurs who've scaled their businesses 
                    with our elite AI agents and automation tools.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    <TacticalButton size="lg" className="group">
                      <Zap className="w-5 h-5 mr-2" />
                      Start Accelerating Now
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </TacticalButton>
                    
                    <Link href="/pricing">
                      <TacticalButton variant="outline" size="lg">
                        Compare All Plans
                      </TacticalButton>
              </Link>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="py-20">
            <div className="container mx-auto px-4">
              <FaqSection />
          </div>
        </div>
        </CamoBackground>
      </div>
    </>
  )
}