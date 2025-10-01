'use client';

import { motion } from 'framer-motion';
import { HolographicNav, HolographicFooter } from '@/components/ui/holographic-nav';
import { HolographicPricingCard, HolographicInfoCard } from '@/components/ui/holographic-pricing-card';
import { HolographicButton, HolographicCard, GradientText } from '@/components/ui/holographic-button';
import { SparkleAnimation, GlitterEffect } from '@/components/ui/sparkle-animation';
import { 
  Check, 
  Star, 
  Zap, 
  Shield, 
  Clock, 
  Users, 
  TrendingUp,
  ArrowRight,
  Sparkles,
  Crown,
  Rocket
} from 'lucide-react';

// Edge Runtime disabled due to Node.js dependency incompatibility

const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#features', sparkles: true },
  { label: 'Pricing', href: '#pricing', sparkles: true },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' }
];

const pricingPlans = [
  {
    title: 'Starter',
    description: 'Perfect for solo founders just getting started',
    price: { monthly: 29, yearly: 290 },
    features: [
      { text: 'AI Business Assistant', included: true, highlight: true },
      { text: 'Basic Workflow Automation', included: true },
      { text: 'Email Support', included: true },
      { text: '5 AI Tasks per Month', included: true },
      { text: 'Basic Analytics Dashboard', included: true },
      { text: 'Mobile App Access', included: true },
      { text: 'Advanced Analytics', included: false },
      { text: 'Priority Support', included: false },
      { text: 'Custom Integrations', included: false },
      { text: 'White-label Options', included: false }
    ],
    ctaText: 'Start Free Trial',
    onCtaClick: () => {
      // Handle starter plan selection
      window.location.href = '/signup?plan=starter'
    }
  },
  {
    title: 'Pro',
    description: 'For growing businesses that need more power',
    price: { monthly: 79, yearly: 790 },
    features: [
      { text: 'Everything in Starter', included: true },
      { text: 'Advanced AI Co-founder', included: true, highlight: true },
      { text: 'Unlimited AI Tasks', included: true },
      { text: 'Advanced Analytics', included: true },
      { text: 'Priority Support', included: true },
      { text: 'Custom Integrations', included: true },
      { text: 'Team Collaboration', included: true },
      { text: 'API Access', included: true },
      { text: 'Custom Workflows', included: true },
      { text: 'White-label Options', included: false }
    ],
    ctaText: 'Go Pro',
    onCtaClick: () => {
      // Handle pro plan selection
      window.location.href = '/signup?plan=pro'
    },
    popular: true
  },
  {
    title: 'Enterprise',
    description: 'For established businesses ready to scale',
    price: { monthly: 199, yearly: 1990 },
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Dedicated AI Specialist', included: true, highlight: true },
      { text: 'Custom AI Training', included: true },
      { text: 'White-label Solutions', included: true },
      { text: '24/7 Phone Support', included: true },
      { text: 'SLA Guarantee', included: true },
      { text: 'Advanced Security', included: true },
      { text: 'Custom Onboarding', included: true },
      { text: 'Dedicated Infrastructure', included: true },
      { text: 'Multi-region Deployment', included: true }
    ],
    ctaText: 'Contact Sales',
    onCtaClick: () => {
      // Handle enterprise plan selection
      window.location.href = '/contact?plan=enterprise'
    }
  }
];

const features = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and SOC 2 compliance keep your data safe and secure.'
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: '24/7 Availability',
    description: 'Your AI co-founder never sleeps. Get instant responses and support around the clock.'
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Team Collaboration',
    description: 'Share insights and collaborate with your team through our intuitive workspace.'
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'Growth Analytics',
    description: 'Track your progress with beautiful, holographic dashboards and insights.'
  }
];

const faqs = [
  {
    question: "Can I change plans anytime?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences."
  },
  {
    question: "What happens after my free trial?",
    answer: "Your account will automatically convert to the Starter plan. You can upgrade, downgrade, or cancel anytime before the trial ends."
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
    answer: "All plans include email support. Pro and Enterprise plans get priority support, and Enterprise includes 24/7 phone support."
  }
];

const socialLinks = [
  { label: 'Twitter', href: '#', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg> },
  { label: 'LinkedIn', href: '#', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { label: 'GitHub', href: '#', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> }
];

const footerLinks = [
  {
    title: 'Product',
    items: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'API', href: '#api', sparkles: true },
      { label: 'Integrations', href: '#integrations' }
    ]
  },
  {
    title: 'Company',
    items: [
      { label: 'About', href: '/#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Careers', href: '#careers' },
      { label: 'Contact', href: '/#contact' }
    ]
  },
  {
    title: 'Resources',
    items: [
      { label: 'Documentation', href: '#docs' },
      { label: 'Help Center', href: '#help' },
      { label: 'Community', href: '#community', sparkles: true },
      { label: 'Status', href: '#status' }
    ]
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <HolographicNav 
        items={navigationItems}
        mobile={true}
        className="backdrop-blur-xl"
      />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <GlitterEffect density="low" className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-br from-SoloSuccess-purple/5 via-SoloSuccess-cyan/5 to-SoloSuccess-pink/5" />
        </div>

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
              <SparkleAnimation intensity="high" size="large" color="rainbow">
                <GradientText className="text-4xl md:text-6xl lg:text-7xl">
                  Choose Your Power Plan
                </GradientText>
              </SparkleAnimation>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8"
            >
              Transform your solo business with AI-powered tools. All plans include a 14-day free trial.
            </motion.p>

            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <span className="text-sm font-medium">Monthly</span>
              <div className="relative">
                <input 
                  type="checkbox" 
                  id="billing-toggle"
                  className="sr-only" 
                  aria-label="Toggle between monthly and yearly billing"
                />
                <label htmlFor="billing-toggle" className="w-12 h-6 bg-SoloSuccess-purple rounded-full relative cursor-pointer block">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-300"></div>
                </label>
            </div>
              <span className="text-sm font-medium">
                Yearly
                <SparkleAnimation intensity="medium" size="small" color="pink">
                  <span className="ml-2 text-xs bg-SoloSuccess-pink text-white px-2 py-1 rounded-full">Save 20%</span>
                </SparkleAnimation>
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
              <HolographicPricingCard
                key={index}
                {...plan}
                sparkles={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-SoloSuccess-purple/5 to-SoloSuccess-cyan/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <GradientText className="text-4xl md:text-5xl">
                Enterprise-Grade Features
              </GradientText>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built for scale, designed for success. Every plan includes powerful features to grow your business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <HolographicInfoCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                sparkles={true}
                className="h-full"
              />
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <GradientText className="text-4xl md:text-5xl">
                Frequently Asked Questions
              </GradientText>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Got questions? We&apos;ve got answers. Here are the most common questions about our pricing and plans.
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
                  <HolographicCard
                    sparkles={false}
                    shine={true}
                    glow={false}
                    interactive={true}
                    className="p-6 h-full"
                  >
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <GradientText className="text-lg">{faq.question}</GradientText>
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </HolographicCard>
                </motion.div>
              ))}
            </div>
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
                <GradientText className="text-4xl md:text-5xl">
                  Ready to Get Started?
                </GradientText>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of solo founders who&apos;ve already transformed their businesses with SoloSuccess AI.
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
                  <Check className="w-4 h-4 text-green-500" />
                  No credit card required
                </motion.div>
              </div>
            </motion.div>
          </HolographicCard>
        </div>
      </section>

      {/* Footer */}
      <HolographicFooter
        links={footerLinks}
        socialLinks={socialLinks}
      />
    </div>
  );
}