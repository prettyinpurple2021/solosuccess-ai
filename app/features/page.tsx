"use client"

// Force dynamic rendering to prevent auth issues during static generation
export const dynamic = 'force-dynamic'

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Crown, 
  Brain, 
  Target, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Shield, 
  Users, 
  Briefcase, 
  Calendar, 
  MessageCircle, 
  Palette, 
  Focus, 
  CheckCircle, 
  Play,
  ArrowRight,
  Star,
  Trophy,
  Sword,
  Gem,
  Infinity,
  Flame,
  Rocket,
  Award
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FeaturesPage() {
  const aiAgents = [
    {
      name: "Roxy",
      role: "Executive Assistant",
      icon: Crown,
      color: "from-military-hot-pink to-military-blush-pink",
      description: "Your personal EA who handles scheduling, emails, and administrative tasks with boss-level efficiency.",
      capabilities: ["Calendar Management", "Email Sorting", "Meeting Coordination", "Task Prioritization"]
    },
    {
      name: "Blaze",
      role: "Growth Strategist",
      icon: TrendingUp,
      color: "from-military-hot-pink to-military-blush-pink",
      description: "The marketing mastermind who develops growth strategies and identifies new business opportunities.",
      capabilities: ["Growth Planning", "Market Analysis", "Strategy Development", "Opportunity Identification"]
    },
    {
      name: "Nova",
      role: "Content Creator",
      icon: Sparkles,
      color: "from-military-hot-pink to-military-blush-pink",
      description: "The creative genius who produces engaging content across all platforms and formats.",
      capabilities: ["Content Strategy", "Copywriting", "Social Media", "Brand Voice"]
    },
    {
      name: "Phoenix",
      role: "Sales Specialist",
      icon: Target,
      color: "from-military-hot-pink to-military-blush-pink",
      description: "The revenue generator who closes deals and builds lasting customer relationships.",
      capabilities: ["Lead Generation", "Sales Scripts", "Follow-up Sequences", "Revenue Optimization"]
    },
    {
      name: "Sage",
      role: "Business Analyst",
      icon: Brain,
      color: "from-military-hot-pink to-military-blush-pink",
      description: "The data wizard who analyzes performance and provides actionable business insights.",
      capabilities: ["Data Analysis", "Performance Tracking", "ROI Optimization", "Strategic Insights"]
    },
    {
      name: "Viper",
      role: "Competitive Intelligence",
      icon: Shield,
      color: "from-military-hot-pink to-military-blush-pink",
      description: "The intelligence operative who monitors competitors and identifies market opportunities.",
      capabilities: ["Competitor Analysis", "Market Research", "Threat Assessment", "Opportunity Mapping"]
    },
    {
      name: "Atlas",
      role: "Project Manager",
      icon: Briefcase,
      color: "from-military-hot-pink to-military-blush-pink",
      description: "The organizational master who keeps projects on track and teams aligned.",
      capabilities: ["Project Planning", "Task Management", "Team Coordination", "Deadline Tracking"]
    },
    {
      name: "Luna",
      role: "Customer Success",
      icon: Users,
      color: "from-military-hot-pink to-military-blush-pink",
      description: "The relationship builder who ensures customer satisfaction and retention.",
      capabilities: ["Customer Onboarding", "Support Tickets", "Retention Strategies", "Feedback Analysis"]
    }
  ]

  const coreFeatures = [
    {
      title: "AI-Powered Automation",
      description: "Streamline your business operations with intelligent automation that works 24/7",
      icon: Zap,
      features: ["Workflow Automation", "Task Scheduling", "Email Management", "Data Processing"]
    },
    {
      title: "Competitive Intelligence",
      description: "Stay ahead of the competition with real-time market insights and competitor analysis",
      icon: Shield,
      features: ["Competitor Monitoring", "Market Analysis", "Threat Detection", "Opportunity Identification"]
    },
    {
      title: "Content Generation",
      description: "Create engaging content across all platforms with AI-powered writing and design tools",
      icon: Sparkles,
      features: ["Blog Posts", "Social Media", "Email Campaigns", "Marketing Materials"]
    },
    {
      title: "Analytics & Insights",
      description: "Make data-driven decisions with comprehensive analytics and performance tracking",
      icon: TrendingUp,
      features: ["Performance Metrics", "ROI Analysis", "Growth Tracking", "Predictive Insights"]
    }
  ]

  const workflows = [
    {
      name: "Lead Generation",
      description: "Automatically identify and qualify potential customers",
      steps: ["Market Research", "Lead Scoring", "Contact Information", "Follow-up Sequences"],
      icon: Target
    },
    {
      name: "Content Marketing",
      description: "Create and distribute content across multiple channels",
      steps: ["Content Planning", "Writing & Design", "Publishing", "Performance Tracking"],
      icon: Sparkles
    },
    {
      name: "Customer Onboarding",
      description: "Streamline the customer journey from signup to success",
      steps: ["Welcome Sequence", "Product Training", "Success Metrics", "Retention Strategies"],
      icon: Users
    },
    {
      name: "Competitive Analysis",
      description: "Monitor competitors and identify market opportunities",
      steps: ["Competitor Tracking", "Market Research", "Threat Assessment", "Strategy Development"],
      icon: Shield
    }
  ]

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
                <Link href="/pricing">
                  <TacticalButton variant="outline" size="sm">
                    View Plans
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
                  Elite Features
                </span>
              </div>
              
              <h1 className="font-heading text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Tactical <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Features</span>
              </h1>
              
              <p className="text-2xl text-military-storm-grey max-w-3xl mx-auto mb-8 leading-relaxed">
                Discover the elite arsenal of AI agents, automation tools, and tactical features 
                designed to dominate your business goals.
              </p>
              
              <TacticalButton size="lg" className="group">
                <Play className="w-5 h-5 mr-2" />
                Explore Features
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </TacticalButton>
            </motion.div>
          </div>
        </div>

        {/* AI Agents Section */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-5xl font-bold text-white mb-6">
                Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">AI Agents</span>
              </h2>
              <p className="text-xl text-military-storm-grey max-w-2xl mx-auto">
                Meet your tactical team of AI agents, each specialized for maximum business impact
              </p>
            </motion.div>

            <TacticalGrid className="max-w-7xl mx-auto">
              {aiAgents.map((agent, index) => (
                <TacticalGridItem key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <GlassCard className="h-full p-8">
                      <div className="text-center mb-6">
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                          <agent.icon className="w-10 h-10 text-white" />
                        </div>
                        
                        <h3 className="font-heading text-2xl font-bold text-white mb-2">{agent.name}</h3>
                        <p className="text-military-hot-pink font-tactical text-sm uppercase tracking-wider">{agent.role}</p>
                      </div>
                      
                      <p className="text-military-storm-grey mb-6 text-center leading-relaxed">
                        {agent.description}
                      </p>
                      
                      <div className="space-y-3">
                        <h4 className="font-heading text-lg font-bold text-white mb-3">Tactical Capabilities:</h4>
                        {agent.capabilities.map((capability, capIndex) => (
                          <div key={capIndex} className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-military-storm-grey text-sm">{capability}</span>
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

        {/* Core Features Section */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-5xl font-bold text-white mb-6">
                Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Capabilities</span>
              </h2>
              <p className="text-xl text-military-storm-grey max-w-2xl mx-auto">
                The fundamental features that power your business success
              </p>
            </motion.div>

            <TacticalGrid className="max-w-6xl mx-auto">
              {coreFeatures.map((feature, index) => (
                <TacticalGridItem key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <GlassCard className="h-full p-8">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="font-heading text-2xl font-bold text-white mb-4 text-center">
                        {feature.title}
                      </h3>
                      
                      <p className="text-military-storm-grey mb-6 text-center leading-relaxed">
                        {feature.description}
                      </p>
                      
                      <div className="space-y-3">
                        {feature.features.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-military-storm-grey text-sm">{item}</span>
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

        {/* Workflows Section */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-5xl font-bold text-white mb-6">
                Tactical <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Workflows</span>
              </h2>
              <p className="text-xl text-military-storm-grey max-w-2xl mx-auto">
                Pre-built automation workflows for common business processes
              </p>
            </motion.div>

            <TacticalGrid className="max-w-6xl mx-auto">
              {workflows.map((workflow, index) => (
                <TacticalGridItem key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <GlassCard className="h-full p-8">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                        <workflow.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="font-heading text-2xl font-bold text-white mb-4 text-center">
                        {workflow.name}
                      </h3>
                      
                      <p className="text-military-storm-grey mb-6 text-center leading-relaxed">
                        {workflow.description}
                      </p>
                      
                      <div className="space-y-3">
                        <h4 className="font-heading text-lg font-bold text-white mb-3">Workflow Steps:</h4>
                        {workflow.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-military-hot-pink/20 flex items-center justify-center">
                              <span className="text-military-hot-pink font-bold text-xs">{stepIndex + 1}</span>
                            </div>
                            <span className="text-military-storm-grey text-sm">{step}</span>
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
                  Ready to Deploy Your Tactical Team?
                </h2>
                
                <p className="text-xl text-military-storm-grey mb-8 max-w-2xl mx-auto">
                  Join thousands of entrepreneurs who've transformed their businesses 
                  with our elite AI agents and tactical features.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <TacticalButton size="lg" className="group">
                    <Rocket className="w-5 h-5 mr-2" />
                    Start Your Mission
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </TacticalButton>
                  
                  <Link href="/pricing">
                    <TacticalButton variant="outline" size="lg">
                      View Pricing
                    </TacticalButton>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </CamoBackground>
    </div>
  )
}