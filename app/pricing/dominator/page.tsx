'use client'
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
  Award,
  Infinity,
  Gem,
  Sword,
  Flame
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
const features = [
  {
    category: "Unlimited Power",
    items: [
      "8 Elite AI Agents",
      "Unlimited Conversations",
      "Custom AI Training",
      "White-label Options",
      "Dedicated Account Manager"
    ]
  },
  {
    category: "Empire Building",
    items: [
      "Advanced Workflow Automation",
      "Custom Integrations",
      "API Access",
      "Priority Support",
      "24/7 Elite Support"
    ]
  },
  {
    category: "Domination Tools",
    items: [
      "Real-time Analytics",
      "Custom Reports",
      "Team Management",
      "Advanced Security",
      "Unlimited Storage"
    ]
  }
]

const testimonials = [
  {
    name: "Alexandra Chen",
    role: "Tech Empire Builder",
    content: "The Dominator plan gave me unlimited power to scale my empire. The custom AI training is revolutionary.",
    rating: 5
  },
  {
    name: "Marcus Thompson",
    role: "Serial Entrepreneur",
    content: "Finally, a plan that matches my ambition. The white-label options helped me dominate multiple markets.",
    rating: 5
  },
  {
    name: "Isabella Rodriguez",
    role: "Business Mogul",
    content: "The dedicated account manager and unlimited features transformed my business operations completely.",
    rating: 5
  }
]

export default function DominatorPricingPage() {
  return (
    <>
      <Script
        id="stripe-pricing-dominator"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Stripe pricing integration for Dominator plan
            window.stripePricingConfig = {
              plan: 'dominator',
              priceId: 'price_1S46P6PpYfwm37m76hqohIw0',
              features: ${JSON.stringify(features)}
            };
          `,
        }}
      />
      
      <div className="min-h-screen bg-military-midnight relative overflow-hidden">
        <CamoBackground opacity={0.1} withGrid>
          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-50 glass-panel-strong border-b border-neon-purple/30">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-20">
                <Link href="/" className="flex items-center gap-3">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-magenta flex items-center justify-center shadow-lg"
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
                  <span className="text-neon-purple font-tactical text-sm uppercase tracking-wider">
                    Elite Empire Tier
                  </span>
                </div>
                
                <h1 className="font-heading text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-magenta">
                    Dominator
                  </span> Plan
                </h1>
                
                <p className="text-2xl text-military-storm-grey max-w-3xl mx-auto mb-8 leading-relaxed">
                  Unlimited power for empire builders. 8 elite AI agents, unlimited conversations, 
                  and white-label options for complete domination.
                </p>
                
                <div className="flex items-center justify-center gap-4 mb-12">
                  <div className="text-6xl font-bold text-neon-purple">$29</div>
                  <div className="text-military-storm-grey">
                    <div className="text-2xl">/month</div>
                    <div className="text-sm">or $290/year</div>
                  </div>
                </div>
                
                <TacticalButton size="lg" className="group">
                  <Crown className="w-5 h-5 mr-2" />
                  Start Dominating Now
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
                  Unlimited <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-magenta">Power</span>
                </h2>
                <p className="text-xl text-military-storm-grey max-w-2xl mx-auto">
                  Everything you need to build and dominate your empire
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
                        <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-neon-purple to-neon-magenta flex items-center justify-center">
                          {index === 0 && <Infinity className="w-8 h-8 text-white" />}
                          {index === 1 && <Sword className="w-8 h-8 text-white" />}
                          {index === 2 && <Gem className="w-8 h-8 text-white" />}
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

          {/* Power Comparison */}
          <div className="py-20">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="font-heading text-5xl font-bold text-white mb-6">
                  Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-magenta">Advantages</span>
                </h2>
                <p className="text-xl text-military-storm-grey max-w-2xl mx-auto">
                  Why empire builders choose the Dominator plan
                </p>
              </motion.div>

              <div className="max-w-4xl mx-auto">
                <GlassCard className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-magenta flex items-center justify-center">
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-heading text-xl font-bold text-white">Unlimited AI Agents</h3>
                          <p className="text-military-storm-grey">Access to all 8 elite AI agents with unlimited conversations</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-magenta flex items-center justify-center">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-heading text-xl font-bold text-white">White-label Options</h3>
                          <p className="text-military-storm-grey">Customize the platform with your own branding</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-magenta flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-heading text-xl font-bold text-white">Dedicated Support</h3>
                          <p className="text-military-storm-grey">Personal account manager and 24/7 elite support</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-magenta flex items-center justify-center">
                          <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-heading text-xl font-bold text-white">Custom AI Training</h3>
                          <p className="text-military-storm-grey">Train AI agents on your specific business data</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-magenta flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-heading text-xl font-bold text-white">Advanced Analytics</h3>
                          <p className="text-military-storm-grey">Real-time insights and custom reporting</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-magenta flex items-center justify-center">
                          <Flame className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-heading text-xl font-bold text-white">Priority Access</h3>
                          <p className="text-military-storm-grey">First access to new features and updates</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
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
                  Empire <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-magenta">Builders</span>
                </h2>
                <p className="text-xl text-military-storm-grey max-w-2xl mx-auto">
                  Hear from successful entrepreneurs who've built empires with our platform
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
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-magenta flex items-center justify-center">
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
                  <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-magenta flex items-center justify-center">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                  
                  <h2 className="font-heading text-4xl font-bold text-white mb-6">
                    Ready to Dominate Your Market?
                  </h2>
                  
                  <p className="text-xl text-military-storm-grey mb-8 max-w-2xl mx-auto">
                    Join the elite entrepreneurs who've built empires with unlimited AI power. 
                    Your competition won't know what hit them.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    <TacticalButton size="lg" className="group">
                      <Crown className="w-5 h-5 mr-2" />
                      Start Dominating Now
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