"use client"

export const dynamic = 'force-dynamic'

import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Crown, 
  Mail, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  Sparkles, 
  Shield,
  Target,
  Users,
  Zap,
  ArrowRight
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      setIsSubmitted(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-military-midnight relative overflow-hidden">
        <CamoBackground opacity={0.1} withGrid>
          <div className="container mx-auto px-4 py-32">
            <GlassCard className="max-w-2xl mx-auto p-12 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                
                <h1 className="font-heading text-4xl font-bold text-white mb-4">
                  Mission Briefing Received
                </h1>
                
                <p className="text-lg text-military-storm-grey mb-8">
                  Your message has been successfully transmitted to our command center. 
                  Our elite support team will respond within 24 hours.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/">
                    <TacticalButton>
                      Return to Base
                    </TacticalButton>
                  </Link>
                  <Link href="/dashboard">
                    <TacticalButton variant="outline">
                      Access Dashboard
                    </TacticalButton>
                  </Link>
                </div>
              </motion.div>
            </GlassCard>
          </div>
        </CamoBackground>
      </div>
    )
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
                  Command Center
                </span>
              </div>
              
              <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Command</span>
              </h1>
              
              <p className="text-xl text-military-storm-grey mb-8 max-w-3xl mx-auto leading-relaxed">
                Need tactical support? Have a mission briefing? Our elite support team is standing by 
                to assist with your business domination objectives.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <TacticalGrid className="max-w-6xl mx-auto mb-16">
              <TacticalGridItem>
                <GlassCard className="h-full p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-4">Email Support</h3>
                  <p className="text-military-storm-grey mb-6">
                    Direct line to our command center for urgent matters
                  </p>
                  <a 
                    href="mailto:support@solosuccess.ai" 
                    className="text-military-hot-pink hover:text-military-blush-pink transition-colors font-tactical"
                  >
                    support@solosuccess.ai
                  </a>
                </GlassCard>
              </TacticalGridItem>
              
              <TacticalGridItem>
                <GlassCard className="h-full p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-4">Live Chat</h3>
                  <p className="text-military-storm-grey mb-6">
                    Real-time tactical support from our elite team
                  </p>
                  <TacticalButton variant="outline" size="sm">
                    Start Chat
                  </TacticalButton>
                </GlassCard>
              </TacticalGridItem>
              
              <TacticalGridItem>
                <GlassCard className="h-full p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-4">Phone Support</h3>
                  <p className="text-military-storm-grey mb-6">
                    Priority support for Dominator tier members
                  </p>
                  <a 
                    href="tel:+1-555-SOLO-AI" 
                    className="text-military-hot-pink hover:text-military-blush-pink transition-colors font-tactical"
                  >
                    +1 (555) SOLO-AI
                  </a>
                </GlassCard>
              </TacticalGridItem>
            </TacticalGrid>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-heading text-4xl font-bold text-white mb-4">
                  Mission Briefing Form
                </h2>
                <p className="text-xl text-military-storm-grey">
                  Submit your tactical requirements and we'll respond with elite precision
                </p>
              </div>
              
              <GlassCard className="p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                      <p className="text-sm">{error}</p>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your name"
                        className="bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@domain.com"
                        className="bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                        Subject *
                      </label>
                      <Input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Brief subject line"
                        className="bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                        Category *
                      </label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className="bg-military-tactical/50 border-military-hot-pink/30 text-white focus:border-military-hot-pink">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-military-tactical border-military-hot-pink/30">
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing & Subscriptions</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                      Mission Details *
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Describe your requirements, issues, or objectives in detail..."
                      rows={6}
                      className="bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink resize-none"
                      required
                    />
                  </div>
                  
                  <div className="text-center">
                    <TacticalButton 
                      type="submit" 
                      size="lg" 
                      disabled={isSubmitting}
                      className="group"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Transmitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Mission Briefing
                        </>
                      )}
                    </TacticalButton>
                  </div>
                </form>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Response Times */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl font-bold text-white mb-4">
                Elite Response Times
              </h2>
              <p className="text-xl text-military-storm-grey">
                Our commitment to rapid tactical support
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-2">Launch Tier</h3>
                <p className="text-military-storm-grey mb-4">Standard support response</p>
                <StatsBadge value="24-48h" label="Response Time" className="text-2xl font-bold text-military-hot-pink" />
              </GlassCard>
              
              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-2">Accelerator Tier</h3>
                <p className="text-military-storm-grey mb-4">Priority support response</p>
                <StatsBadge value="12-24h" label="Response Time" className="text-2xl font-bold text-military-hot-pink" />
              </GlassCard>
              
              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-2">Dominator Tier</h3>
                <p className="text-military-storm-grey mb-4">Elite priority support</p>
                <StatsBadge value="2-4h" label="Response Time" className="text-2xl font-bold text-military-hot-pink" />
              </GlassCard>
            </div>
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
                <Link href="/about" className="hover:text-military-hot-pink transition-colors">About</Link>
              </div>
            </div>
          </div>
        </footer>
      </CamoBackground>
    </div>
  )
}