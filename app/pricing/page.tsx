'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Check,
  Star,
  Zap,
  Shield,
  Clock,
  Users,
  TrendingUp,
  ArrowRight,
  Crown,
  Rocket,
  Target,
  Award,
  ChevronRight
} from 'lucide-react';
import {
  TacticalButton,
  GlassCard,
  RankStars,
  CamoBackground,
  SergeantDivider,
  StatsBadge,
  TacticalGrid
} from '@/components/military';

// Real Stripe pricing data matching lib/stripe.ts
const pricingPlans = [
  {
    id: 'launch',
    title: 'Launch',
    subtitle: 'Basic Operations',
    description: 'Perfect for solo founders just getting started',
    price: { monthly: 0, yearly: 0 },
    originalPrice: null,
    features: [
      { text: '2 AI Agents Access', included: true, highlight: true },
      { text: '5 Daily Conversations', included: true },
      { text: 'Basic Workflow Automation', included: true },
      { text: 'Email Support', included: true },
      { text: 'Basic Analytics Dashboard', included: true },
      { text: 'Mobile App Access', included: true },
      { text: 'Advanced Analytics', included: false },
      { text: 'Priority Support', included: false },
      { text: 'Custom Integrations', included: false },
      { text: 'White-label Options', included: false }
    ],
    ctaText: 'Start Free',
    stripePriceId: 'price_1S46IjPpYfwm37m7EKFi7H4C',
    popular: false,
    rank: 'Private',
    stars: 1
  },
  {
    id: 'accelerator',
    title: 'Accelerator',
    subtitle: 'Tactical Advantage',
    description: 'For growing businesses that need more power',
    price: { monthly: 19, yearly: 190 },
    originalPrice: { monthly: 24, yearly: 240 },
    features: [
      { text: 'Everything in Launch', included: true },
      { text: '5 AI Agents Access', included: true, highlight: true },
      { text: '100 Daily Conversations', included: true },
      { text: 'Advanced Analytics', included: true },
      { text: 'Priority Support', included: true },
      { text: 'Custom Integrations', included: true },
      { text: 'Team Collaboration', included: true },
      { text: 'API Access', included: true },
      { text: 'Custom Workflows', included: true },
      { text: 'White-label Options', included: false }
    ],
    ctaText: 'Deploy Now',
    stripePriceId: 'price_1S46LyPpYfwm37m7M5nOAYW7',
    popular: true,
    rank: 'Sergeant',
    stars: 3
  },
  {
    id: 'dominator',
    title: 'Dominator',
    subtitle: 'Command & Control',
    description: 'For established businesses ready to scale',
    price: { monthly: 29, yearly: 290 },
    originalPrice: { monthly: 36, yearly: 360 },
    features: [
      { text: 'Everything in Accelerator', included: true },
      { text: '8 AI Agents Access', included: true, highlight: true },
      { text: 'Unlimited Conversations', included: true },
      { text: 'Dedicated AI Specialist', included: true },
      { text: 'Custom AI Training', included: true },
      { text: 'White-label Solutions', included: true },
      { text: '24/7 Phone Support', included: true },
      { text: 'SLA Guarantee', included: true },
      { text: 'Advanced Security', included: true },
      { text: 'Custom Onboarding', included: true },
      { text: 'Dedicated Infrastructure', included: true },
      { text: 'Multi-region Deployment', included: true }
    ],
    ctaText: 'Take Command',
    stripePriceId: 'price_1S46P6PpYfwm37m76hqohIw0',
    popular: false,
    rank: 'Commander',
    stars: 5
  }
];

const features = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Military-Grade Security',
    description: 'Bank-level encryption and SOC 2 compliance keep your data secure and protected.'
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: '24/7 Operations',
    description: 'Your AI command center never sleeps. Get instant responses and support around the clock.'
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Squad Collaboration',
    description: 'Share intelligence and collaborate with your team through our tactical workspace.'
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'Mission Analytics',
    description: 'Track your progress with tactical dashboards and strategic insights.'
  }
];

const faqs = [
  {
    question: "Can I change plans anytime?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences."
  },
  {
    question: "What happens after my free trial?",
    answer: "Your account will automatically convert to the Launch plan. You can upgrade, downgrade, or cancel anytime before the trial ends."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund your payment."
  },
  {
    question: "Is there a setup fee?",
    answer: "No setup fees, no hidden costs. What you see is what you pay. All plans include onboarding and basic setup support."
  },
  {
    question: "Can I use SoloSuccess with my existing tools?",
    answer: "Absolutely! We integrate with 100+ popular business tools including Slack, Zapier, Google Workspace, and more."
  },
  {
    question: "What kind of support do you provide?",
    answer: "All plans include email support. Accelerator and Dominator plans get priority support, and Dominator includes 24/7 phone support."
  }
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const handlePlanSelect = (planId: string, stripePriceId: string) => {
    // Redirect to signup with plan selection
    window.location.href = `/signup?plan=${planId}&price=${stripePriceId}&billing=${isYearly ? 'yearly' : 'monthly'}`;
  };

  return (
    <div className="min-h-screen bg-military-midnight">
      {/* Camo Background */}
      <CamoBackground />

      {/* Tactical Grid Overlay */}
      <TacticalGrid />

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-xl bg-military-tactical/80 border-b border-military-hot-pink/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-military-hot-pink to-military-blush-pink rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-military-glass-white">
                SoloSuccess AI
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-military-glass-white hover:text-military-hot-pink transition-colors">
                Home
              </a>
              <a href="/#features" className="text-military-glass-white hover:text-military-hot-pink transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-military-hot-pink font-semibold">
                Pricing
              </a>
              <a href="/#about" className="text-military-glass-white hover:text-military-hot-pink transition-colors">
                About
              </a>
              <a href="/#contact" className="text-military-glass-white hover:text-military-hot-pink transition-colors">
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="/signin"
                className="text-military-glass-white hover:text-military-hot-pink transition-colors"
              >
                Sign In
              </a>
              <TacticalButton
                variant="primary"
                size="sm"
                onClick={() => window.location.href = '/signup'}
              >
                Deploy Now
              </TacticalButton>
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6"
            >
              <RankStars count={5} size="lg" className="justify-center mb-4" />
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6">
                <span className="bg-gradient-to-r from-military-hot-pink via-military-blush-pink to-military-dusty-rose bg-clip-text text-transparent">
                  Choose Your Mission Plan
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-military-storm-grey leading-relaxed mb-8"
            >
              Transform your solo business with AI-powered tactical tools. All plans include a 14-day free trial.
            </motion.p>

            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <span className="text-sm font-medium text-military-glass-white">Monthly</span>
              <div className="relative">
                <input
                  type="checkbox"
                  id="billing-toggle"
                  className="sr-only"
                  checked={isYearly}
                  onChange={(e) => setIsYearly(e.target.checked)}
                  aria-label="Toggle between monthly and yearly billing"
                />
                <label htmlFor="billing-toggle" className="w-12 h-6 bg-military-gunmetal rounded-full relative cursor-pointer block">
                  <div className={`w-5 h-5 bg-military-hot-pink rounded-full absolute top-0.5 left-0.5 transition-transform duration-300 ${isYearly ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                </label>
              </div>
              <span className="text-sm font-medium text-military-glass-white flex items-center gap-2">
                Yearly
                <StatsBadge variant="success" size="sm">
                  Save 20%
                </StatsBadge>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                className="relative"
              >
                <GlassCard
                  className={`p-8 h-full ${plan.popular ? 'ring-2 ring-military-hot-pink/50' : ''}`}
                  glow={plan.popular}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <StatsBadge variant="warning" size="lg">
                        <Crown className="w-4 h-4 mr-1" />
                        Most Popular
                      </StatsBadge>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <RankStars count={plan.stars} size="md" className="justify-center mb-4" />
                    <h3 className="text-2xl font-heading font-bold text-military-glass-white mb-2">
                      {plan.title}
                    </h3>
                    <p className="text-military-hot-pink font-semibold mb-2">{plan.subtitle}</p>
                    <p className="text-military-storm-grey text-sm">{plan.description}</p>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-military-glass-white">
                        ${isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      <span className="text-military-storm-grey ml-2">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    </div>
                    {plan.originalPrice && (
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-military-storm-grey line-through">
                          ${isYearly ? plan.originalPrice.yearly : plan.originalPrice.monthly}
                        </span>
                        <StatsBadge variant="success" size="sm">
                          Save ${isYearly ? plan.originalPrice.yearly - plan.price.yearly : plan.originalPrice.monthly - plan.price.monthly}
                        </StatsBadge>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${feature.included
                          ? 'bg-military-hot-pink/20 text-military-hot-pink'
                          : 'bg-military-gunmetal/20 text-military-storm-grey'
                          }`}>
                          {feature.included ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-military-storm-grey" />
                          )}
                        </div>
                        <span className={`text-sm ${feature.included
                          ? feature.highlight
                            ? 'text-military-hot-pink font-semibold'
                            : 'text-military-glass-white'
                          : 'text-military-storm-grey'
                          }`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <TacticalButton
                    variant={plan.popular ? 'primary' : 'secondary'}
                    size="lg"
                    className="w-full"
                    onClick={() => handlePlanSelect(plan.id, plan.stripePriceId)}
                  >
                    {plan.ctaText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </TacticalButton>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <RankStars count={5} size="lg" className="justify-center mb-4" />
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              <span className="bg-gradient-to-r from-military-hot-pink via-military-blush-pink to-military-dusty-rose bg-clip-text text-transparent">
                Military-Grade Features
              </span>
            </h2>
            <p className="text-xl text-military-storm-grey max-w-3xl mx-auto">
              Built for tactical advantage, designed for mission success. Every plan includes powerful features to dominate your market.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
              >
                <GlassCard className="p-6 h-full text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-military-hot-pink to-military-blush-pink rounded-xl flex items-center justify-center mx-auto mb-4">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-military-glass-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-military-storm-grey text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              <span className="bg-gradient-to-r from-military-hot-pink via-military-blush-pink to-military-dusty-rose bg-clip-text text-transparent">
                Mission Briefing
              </span>
            </h2>
            <p className="text-xl text-military-storm-grey max-w-3xl mx-auto">
              Got questions? We've got intel. Here are the most common questions about our tactical plans.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GlassCard className="p-6 h-full">
                    <h3 className="text-lg font-heading font-semibold text-military-glass-white mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-military-hot-pink" />
                      {faq.question}
                    </h3>
                    <p className="text-military-storm-grey text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 text-center">
          <GlassCard className="max-w-4xl mx-auto p-12" glow>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <RankStars count={5} size="lg" className="justify-center mb-6" />
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                <span className="bg-gradient-to-r from-military-hot-pink via-military-blush-pink to-military-dusty-rose bg-clip-text text-transparent">
                  Ready to Deploy?
                </span>
              </h2>
              <p className="text-xl text-military-storm-grey mb-8 max-w-2xl mx-auto">
                Join thousands of solo founders who've already transformed their businesses with SoloSuccess AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <TacticalButton
                  variant="primary"
                  size="lg"
                  className="text-lg"
                  onClick={() => window.location.href = '/signup'}
                >
                  Start Your Mission
                  <Rocket className="w-5 h-5 ml-2" />
                </TacticalButton>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 text-sm text-military-storm-grey"
                >
                  <Check className="w-4 h-4 text-military-hot-pink" />
                  No credit card required
                </motion.div>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-military-tactical/50 backdrop-blur-xl border-t border-military-hot-pink/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-military-hot-pink to-military-blush-pink rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading text-xl font-bold text-military-glass-white">
                  SoloSuccess AI
                </span>
              </div>
              <p className="text-military-storm-grey text-sm">
                Transform your solo business with AI-powered tactical tools.
              </p>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-military-glass-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="/#features" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">Features</a></li>
                <li><a href="#pricing" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">Pricing</a></li>
                <li><a href="/#api" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">API</a></li>
                <li><a href="/#integrations" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-military-glass-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="/#about" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">About</a></li>
                <li><a href="/#blog" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">Blog</a></li>
                <li><a href="/#careers" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">Careers</a></li>
                <li><a href="/#contact" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-military-glass-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="/#docs" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">Documentation</a></li>
                <li><a href="/#help" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">Help Center</a></li>
                <li><a href="/#community" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">Community</a></li>
                <li><a href="/#status" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">Status</a></li>
              </ul>
            </div>
          </div>

          <SergeantDivider className="my-8" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-military-storm-grey text-sm">
              © 2025 SoloSuccess AI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">Privacy</a>
              <a href="/terms" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">Terms</a>
              <a href="/cookies" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}