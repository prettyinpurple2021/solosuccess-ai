"use client"

export const dynamic = 'force-dynamic'

import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Search,
  MessageCircle,
  Video,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Zap,
  Users,
  Settings,
  Crown,
  Target,
  Shield,
  Brain,
  Trophy,
  ArrowRight,
  BookOpen,
  PlayCircle,
  FileText,
  Star
} from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

interface GuideItem {
  id: string
  title: string
  description: string
  icon: any
  href: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  const faqData: FAQItem[] = [
    {
      id: "getting-started",
      question: "How do I get started with SoloSuccess AI?",
      answer: "Getting started is simple! Sign up for an account, choose your subscription tier, and complete the onboarding process. Our AI will then analyze your business and provide personalized recommendations.",
      category: "getting-started"
    },
    {
      id: "subscription-tiers",
      question: "What's the difference between subscription tiers?",
      answer: "Launch tier provides basic AI agents and limited conversations. Accelerator tier offers 5 AI agents and 100 daily conversations. Dominator tier gives you unlimited access to all 8 AI agents with no conversation limits.",
      category: "billing"
    },
    {
      id: "ai-agents",
      question: "How do the AI agents work?",
      answer: "Our AI agents are specialized for different business functions. Each agent has unique capabilities and can help with specific tasks like marketing, sales, strategy, and more. You can interact with them through our chat interface.",
      category: "features"
    },
    {
      id: "data-security",
      question: "Is my business data secure?",
      answer: "Absolutely! We use military-grade encryption and security protocols. Your data is never shared with third parties and is protected by enterprise-level security measures.",
      category: "security"
    },
    {
      id: "billing-questions",
      question: "How does billing work?",
      answer: "Billing is handled securely through Stripe. You can upgrade, downgrade, or cancel your subscription at any time through your account settings. All subscriptions are billed automatically.",
      category: "billing"
    },
    {
      id: "feature-limits",
      question: "What are the usage limits?",
      answer: "Usage limits vary by subscription tier. Launch users get 2 AI agents and 5 daily conversations. Accelerator users get 5 agents and 100 daily conversations. Dominator users have unlimited access.",
      category: "features"
    }
  ]

  const guideData: GuideItem[] = [
    {
      id: "onboarding",
      title: "Complete Onboarding Guide",
      description: "Step-by-step guide to setting up your account and maximizing your success",
      icon: Target,
      href: "/guides/onboarding",
      difficulty: "beginner"
    },
    {
      id: "ai-agents",
      title: "Mastering AI Agents",
      description: "Learn how to effectively use each AI agent for maximum business impact",
      icon: Brain,
      href: "/guides/ai-agents",
      difficulty: "intermediate"
    },
    {
      id: "advanced-features",
      title: "Advanced Features Guide",
      description: "Unlock the full potential of SoloSuccess AI with advanced techniques",
      icon: Zap,
      href: "/guides/advanced-features",
      difficulty: "advanced"
    },
    {
      id: "integration",
      title: "Third-Party Integrations",
      description: "Connect SoloSuccess AI with your existing business tools and workflows",
      icon: Settings,
      href: "/guides/integrations",
      difficulty: "intermediate"
    }
  ]

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-400"
      case "intermediate": return "text-yellow-400"
      case "advanced": return "text-red-400"
      default: return "text-military-storm-grey"
    }
  }

  return (
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
                <Link href="/signin">
                  <TacticalButton variant="outline" size="sm">
                    Sign In
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
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <RankStars count={5} size="lg" />
                <span className="text-military-hot-pink font-tactical text-sm uppercase tracking-wider">
                  Tactical Support Center
                </span>
              </div>

              <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Support</span>
              </h1>

              <p className="text-xl text-military-storm-grey mb-8 max-w-3xl mx-auto leading-relaxed">
                Master the art of business domination with our comprehensive guides,
                tutorials, and elite support resources.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-military-storm-grey" />
                  <Input
                    type="text"
                    placeholder="Search for help topics, guides, or FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-4 bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink text-lg"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-white mb-4">
                Quick Tactical Actions
              </h2>
              <p className="text-xl text-military-storm-grey">
                Get immediate access to the most common support resources
              </p>
            </div>

            <TacticalGrid className="max-w-6xl mx-auto">
              <TacticalGridItem>
                <GlassCard className="h-full p-8 text-center group cursor-pointer hover:scale-105 transition-transform">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-4">Documentation</h3>
                  <p className="text-military-storm-grey mb-6">
                    Comprehensive guides and technical documentation
                  </p>
                  <TacticalButton variant="outline" size="sm">
                    View Docs
                  </TacticalButton>
                </GlassCard>
              </TacticalGridItem>

              <TacticalGridItem>
                <GlassCard className="h-full p-8 text-center group cursor-pointer hover:scale-105 transition-transform">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-4">Video Tutorials</h3>
                  <p className="text-military-storm-grey mb-6">
                    Step-by-step video guides for all features
                  </p>
                  <TacticalButton variant="outline" size="sm">
                    Watch Videos
                  </TacticalButton>
                </GlassCard>
              </TacticalGridItem>

              <TacticalGridItem>
                <GlassCard className="h-full p-8 text-center group cursor-pointer hover:scale-105 transition-transform">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-4">Live Chat</h3>
                  <p className="text-military-storm-grey mb-6">
                    Get instant help from our elite support team
                  </p>
                  <TacticalButton variant="outline" size="sm">
                    Start Chat
                  </TacticalButton>
                </GlassCard>
              </TacticalGridItem>
            </TacticalGrid>
          </div>
        </section>

        {/* Learning Guides */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-white mb-4">
                Elite Learning Paths
              </h2>
              <p className="text-xl text-military-storm-grey">
                Master SoloSuccess AI with our structured learning programs
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {guideData.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <GlassCard className="p-8 group cursor-pointer hover:scale-105 transition-transform">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center group-hover:scale-110 transition-transform">
                        <guide.icon className="w-8 h-8 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-heading text-2xl font-bold text-white">{guide.title}</h3>
                          <span className={`text-sm font-tactical uppercase tracking-wider ${getDifficultyColor(guide.difficulty)}`}>
                            {guide.difficulty}
                          </span>
                        </div>

                        <p className="text-military-storm-grey mb-6 leading-relaxed">
                          {guide.description}
                        </p>

                        <div className="flex items-center gap-4">
                          <TacticalButton variant="outline" size="sm" className="group">
                            Start Guide
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </TacticalButton>

                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-military-hot-pink fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-military-storm-grey mb-8">
                Quick answers to the most common tactical questions
              </p>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {["all", "getting-started", "billing", "features", "security"].map((category) => (
                  <TacticalButton
                    key={category}
                    variant={selectedCategory === category ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category.replace("-", " ")}
                  </TacticalButton>
                ))}
              </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <GlassCard className="p-6">
                    <Collapsible open={openFAQ === faq.id} onOpenChange={(open) => setOpenFAQ(open ? faq.id : null)}>
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between">
                          <h3 className="font-heading text-xl font-bold text-white text-left">
                            {faq.question}
                          </h3>
                          <ChevronDown className={`w-6 h-6 text-military-hot-pink transition-transform ${openFAQ === faq.id ? 'rotate-180' : ''}`} />
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="mt-4">
                        <SergeantDivider className="mb-4" />
                        <p className="text-military-storm-grey leading-relaxed">
                          {faq.answer}
                        </p>
                      </CollapsibleContent>
                    </Collapsible>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <GlassCard className="max-w-4xl mx-auto p-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>

                <h2 className="font-heading text-4xl font-bold text-white mb-6">
                  Still Need Tactical Support?
                </h2>

                <p className="text-xl text-military-storm-grey mb-8 max-w-2xl mx-auto">
                  Our elite support team is standing by to assist with your mission.
                  Get personalized help from our experts.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/contact">
                    <TacticalButton size="lg" className="group">
                      Contact Support
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </TacticalButton>
                  </Link>
                  <Link href="/dashboard">
                    <TacticalButton variant="outline" size="lg">
                      Access Dashboard
                    </TacticalButton>
                  </Link>
                </div>
              </motion.div>
            </GlassCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-military-hot-pink/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading text-lg font-bold text-white">SoloSuccess AI</span>
              </div>

              <div className="flex items-center gap-6 text-military-storm-grey">
                <Link href="/privacy" className="hover:text-military-hot-pink transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-military-hot-pink transition-colors">Terms</Link>
                <Link href="/contact" className="hover:text-military-hot-pink transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
      </CamoBackground>
    </div>
  )
} 