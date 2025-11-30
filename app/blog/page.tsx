"use client"

export const dynamic = 'force-dynamic'

import Link from "next/link"
import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Crown,
  Calendar,
  BookOpen,
  Sparkles,
  Bell,
  Mail,
  Target,
  Users,
  Zap,
  ArrowRight,
  Star,
  TrendingUp,
  Brain,
  Shield,
  Trophy,
  Clock,
  Tag
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

export default function BlogComingSoonPage() {
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const submitNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || submitting) return
    setSubmitting(true)
    setMessage("")
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'blog_hero' }),
      })
      if (res.ok) {
        setMessage("Mission briefing subscribed! Check your email for confirmation.")
        setEmail("")
      } else {
        setMessage("Transmission failed. Please try again.")
      }
    } catch (error) {
      setMessage("Communication error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const blogPosts = [
    {
      id: "ai-business-automation",
      title: "How to Automate Your Revenue Workflows with AI",
      excerpt: "Discover the tactical advantages of AI-powered business automation and how to implement revenue-generating workflows that work 24/7.",
      author: "SoloSuccess Command",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "Automation",
      featured: true,
      tags: ["AI", "Automation", "Revenue", "Workflows"]
    },
    {
      id: "marketing-system-ai",
      title: "Building a Marketing System with AI",
      excerpt: "Learn how to create a military-grade marketing system that generates leads and converts prospects using AI-powered strategies.",
      author: "SoloSuccess Command",
      date: "2024-01-10",
      readTime: "12 min read",
      category: "Marketing",
      featured: false,
      tags: ["Marketing", "AI", "Lead Generation", "Conversion"]
    },
    {
      id: "scale-solo-business",
      title: "How to Scale a Solo Business to 7 Figures",
      excerpt: "Elite strategies for scaling your solo business from startup to market-dominating empire using AI and automation.",
      author: "SoloSuccess Command",
      date: "2024-01-05",
      readTime: "15 min read",
      category: "Scaling",
      featured: false,
      tags: ["Scaling", "Business Growth", "Strategy", "Leadership"]
    }
  ]

  const categories = ["All", "Automation", "Marketing", "Scaling", "AI", "Strategy", "Leadership"]

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
                  Elite Intelligence Briefings
                </span>
              </div>

              <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Tactical <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Intelligence</span>
              </h1>

              <p className="text-xl text-military-storm-grey mb-8 max-w-3xl mx-auto leading-relaxed">
                Elite strategies, proven tactics, and cutting-edge insights for solo entrepreneurs
                who refuse to settle for mediocrity. Learn from the best, dominate your market.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <TacticalButton size="lg" className="group">
                  Explore Intelligence
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </TacticalButton>
                <TacticalButton variant="outline" size="lg">
                  Subscribe to Briefings
                </TacticalButton>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <GlassCard className="max-w-4xl mx-auto p-12">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                  <Bell className="w-10 h-10 text-white" />
                </div>

                <h2 className="font-heading text-4xl font-bold text-white mb-6">
                  Elite Intelligence Briefings
                </h2>

                <p className="text-xl text-military-storm-grey mb-8 max-w-2xl mx-auto">
                  Get exclusive tactical insights, proven strategies, and elite business intelligence
                  delivered directly to your command center.
                </p>

                <form onSubmit={submitNewsletter} className="max-w-md mx-auto">
                  <div className="flex gap-4">
                    <Input
                      type="email"
                      placeholder="Enter your tactical email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink"
                      required
                    />
                    <TacticalButton
                      type="submit"
                      disabled={submitting}
                      className="group"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Transmitting...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Subscribe
                        </>
                      )}
                    </TacticalButton>
                  </div>

                  {message && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 text-sm ${message.includes('subscribed') ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {message}
                    </motion.p>
                  )}
                </form>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Featured Content */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold text-white mb-4">
                Elite Intelligence Reports
              </h2>
              <p className="text-xl text-military-storm-grey">
                Tactical insights from the front lines of business domination
              </p>
            </div>

            {/* Featured Post */}
            <div className="max-w-6xl mx-auto mb-16">
              {blogPosts.filter(post => post.featured).map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <GlassCard className="p-12 group cursor-pointer hover:scale-105 transition-transform">
                    <div className="flex items-start gap-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-6">
                          <span className="px-3 py-1 bg-military-hot-pink/20 text-military-hot-pink text-sm font-tactical uppercase tracking-wider rounded-full">
                            Featured Intelligence
                          </span>
                          <div className="flex items-center gap-2 text-military-storm-grey">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{post.readTime}</span>
                          </div>
                        </div>

                        <h3 className="font-heading text-3xl font-bold text-white mb-4 group-hover:text-military-hot-pink transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-lg text-military-storm-grey mb-6 leading-relaxed">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-military-storm-grey" />
                              <span className="text-military-storm-grey text-sm">{post.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-military-storm-grey" />
                              <span className="text-military-storm-grey text-sm">{new Date(post.date).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <TacticalButton variant="outline" className="group">
                            Read Intelligence
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </TacticalButton>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-6">
                          {post.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-military-tactical/50 text-military-storm-grey text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Other Posts */}
            <TacticalGrid className="max-w-6xl mx-auto">
              {blogPosts.filter(post => !post.featured).map((post, index) => (
                <TacticalGridItem key={post.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <GlassCard className="h-full p-8 group cursor-pointer hover:scale-105 transition-transform">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-2 py-1 bg-military-hot-pink/20 text-military-hot-pink text-xs font-tactical uppercase tracking-wider rounded-full">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-military-storm-grey" />
                          <span className="text-military-storm-grey text-xs">{post.readTime}</span>
                        </div>
                      </div>

                      <h3 className="font-heading text-xl font-bold text-white mb-4 group-hover:text-military-hot-pink transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-military-storm-grey mb-6 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-military-storm-grey text-sm">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>

                        <TacticalButton variant="outline" size="sm" className="group">
                          Read
                          <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </TacticalButton>
                      </div>
                    </GlassCard>
                  </motion.div>
                </TacticalGridItem>
              ))}
            </TacticalGrid>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-white mb-4">
                Intelligence Categories
              </h2>
              <p className="text-xl text-military-storm-grey">
                Explore tactical insights by specialization
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
              {categories.map((category, index) => (
                <TacticalButton
                  key={category}
                  variant={selectedCategory === category ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="group"
                >
                  {category}
                  {category !== "All" && (
                    <span className="ml-2 px-2 py-1 bg-military-hot-pink/20 text-military-hot-pink text-xs rounded-full">
                      {Math.floor(Math.random() * 10) + 1}
                    </span>
                  )}
                </TacticalButton>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <GlassCard className="max-w-4xl mx-auto p-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>

                <h2 className="font-heading text-4xl font-bold text-white mb-6">
                  Ready to Dominate Your Market?
                </h2>

                <p className="text-xl text-military-storm-grey mb-8 max-w-2xl mx-auto">
                  Stop reading about success and start building it. Get access to the same
                  AI-powered tools and strategies used by elite entrepreneurs.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/signup">
                    <TacticalButton size="lg" className="group">
                      Start Your Mission
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </TacticalButton>
                  </Link>
                  <Link href="/pricing">
                    <TacticalButton variant="outline" size="lg">
                      View Plans
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