"use client"

export const dynamic = 'force-dynamic'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Sparkles, 
  Crown, 
  Zap, 
  Clock, 
  Users, 
  TrendingUp,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Download,
  Eye,
  Target,
  Shield,
  Brain,
  Briefcase,
  Calendar,
  MessageCircle,
  Palette,
  Focus,
  Rocket,
  Trophy,
  Sword,
  Gem,
  Infinity,
  Flame,
  Award,
  Settings,
  BarChart3,
  Workflow,
  GitBranch,
  Layers,
  Activity
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

export default function WorkflowsPage() {
  const workflowCategories = [
    {
      name: "Lead Generation",
      description: "Automated workflows for identifying and nurturing potential customers",
      icon: Target,
      color: "from-military-hot-pink to-military-blush-pink",
      workflows: [
        "Social Media Lead Capture",
        "Email List Building",
        "Content Lead Magnets",
        "Referral Systems"
      ]
    },
    {
      name: "Sales Automation",
      description: "Streamlined sales processes from prospect to close",
      icon: TrendingUp,
      color: "from-military-hot-pink to-military-blush-pink",
      workflows: [
        "Follow-up Sequences",
        "Proposal Generation",
        "Contract Management",
        "Payment Processing"
      ]
    },
    {
      name: "Content Marketing",
      description: "Automated content creation and distribution systems",
      icon: Sparkles,
      color: "from-military-hot-pink to-military-blush-pink",
      workflows: [
        "Blog Post Automation",
        "Social Media Scheduling",
        "Email Newsletter",
        "Content Repurposing"
      ]
    },
    {
      name: "Customer Success",
      description: "Automated customer onboarding and retention processes",
      icon: Users,
      color: "from-military-hot-pink to-military-blush-pink",
      workflows: [
        "Onboarding Sequences",
        "Support Ticket Routing",
        "Feedback Collection",
        "Retention Campaigns"
      ]
    }
  ]

  const featuredWorkflows = [
    {
      name: "Complete Sales Funnel",
      description: "End-to-end automation from lead capture to customer success",
      steps: 12,
      estimatedTime: "2-3 hours setup",
      difficulty: "Advanced",
      icon: GitBranch,
      color: "from-military-hot-pink to-military-blush-pink"
    },
    {
      name: "Content Marketing Machine",
      description: "Automated content creation and distribution across all channels",
      steps: 8,
      estimatedTime: "1-2 hours setup",
      difficulty: "Intermediate",
      icon: Layers,
      color: "from-military-hot-pink to-military-blush-pink"
    },
    {
      name: "Customer Onboarding System",
      description: "Automated customer journey from signup to success",
      steps: 6,
      estimatedTime: "30-45 minutes setup",
      difficulty: "Beginner",
      icon: Activity,
      color: "from-military-hot-pink to-military-blush-pink"
    }
  ]

  const workflowSteps = [
    {
      step: 1,
      title: "Define Your Goals",
      description: "Identify what you want to achieve with your workflow",
      icon: Target
    },
    {
      step: 2,
      title: "Map Your Process",
      description: "Break down your workflow into clear, actionable steps",
      icon: GitBranch
    },
    {
      step: 3,
      title: "Configure Automation",
      description: "Set up triggers, conditions, and actions for each step",
      icon: Settings
    },
    {
      step: 4,
      title: "Test & Deploy",
      description: "Test your workflow and deploy it for maximum impact",
      icon: Rocket
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
                <Link href="/dashboard">
                  <TacticalButton variant="outline" size="sm">
                    Dashboard
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
                  Elite Automation
                </span>
              </div>
              
              <h1 className="font-heading text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Tactical <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Workflows</span>
              </h1>
              
              <p className="text-2xl text-military-storm-grey max-w-3xl mx-auto mb-8 leading-relaxed">
                Deploy automated workflows that handle your business operations 24/7. 
                From lead generation to customer success, automate everything with military precision.
              </p>
              
              <TacticalButton size="lg" className="group">
                <Workflow className="w-5 h-5 mr-2" />
                Deploy Workflows
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </TacticalButton>
            </motion.div>
          </div>
        </div>

        {/* Workflow Categories */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-5xl font-bold text-white mb-6">
                Workflow <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Categories</span>
              </h2>
              <p className="text-xl text-military-storm-grey max-w-2xl mx-auto">
                Organized by tactical function for maximum operational efficiency
              </p>
            </motion.div>

            <TacticalGrid className="max-w-7xl mx-auto">
              {workflowCategories.map((category, index) => (
                <TacticalGridItem key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <GlassCard className="h-full p-8">
                      <div className="text-center mb-6">
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                          <category.icon className="w-10 h-10 text-white" />
                        </div>
                        
                        <h3 className="font-heading text-2xl font-bold text-white mb-2">{category.name}</h3>
                        <p className="text-military-storm-grey mb-4">{category.description}</p>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-heading text-lg font-bold text-white mb-3">Available Workflows:</h4>
                        {category.workflows.map((workflow, workflowIndex) => (
                          <div key={workflowIndex} className="flex items-center gap-3 p-3 bg-military-tactical/20 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                              <span className="text-white font-bold text-xs">{workflowIndex + 1}</span>
                            </div>
                            <span className="text-military-storm-grey text-sm">{workflow}</span>
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

        {/* Featured Workflows */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-5xl font-bold text-white mb-6">
                Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Workflows</span>
              </h2>
              <p className="text-xl text-military-storm-grey max-w-2xl mx-auto">
                Battle-tested workflows used by successful entrepreneurs
              </p>
            </motion.div>

            <TacticalGrid className="max-w-6xl mx-auto">
              {featuredWorkflows.map((workflow, index) => (
                <TacticalGridItem key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <GlassCard className="h-full p-8">
                      <div className="text-center mb-6">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${workflow.color} flex items-center justify-center`}>
                          <workflow.icon className="w-8 h-8 text-white" />
                        </div>
                        
                        <h3 className="font-heading text-2xl font-bold text-white mb-2">{workflow.name}</h3>
                        <p className="text-military-storm-grey mb-4">{workflow.description}</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-military-storm-grey">Steps:</span>
                          <span className="text-white font-bold">{workflow.steps}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-military-storm-grey">Setup Time:</span>
                          <span className="text-white font-bold">{workflow.estimatedTime}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-military-storm-grey">Difficulty:</span>
                          <span className={`font-bold ${
                            workflow.difficulty === 'Beginner' ? 'text-green-400' :
                            workflow.difficulty === 'Intermediate' ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {workflow.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <TacticalButton className="w-full group">
                          <Play className="w-4 h-4 mr-2" />
                          Deploy Workflow
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </TacticalButton>
                      </div>
                    </GlassCard>
                  </motion.div>
                </TacticalGridItem>
              ))}
            </TacticalGrid>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-5xl font-bold text-white mb-6">
                How <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">It Works</span>
              </h2>
              <p className="text-xl text-military-storm-grey max-w-2xl mx-auto">
                Deploy tactical workflows in four simple steps
              </p>
            </motion.div>

            <div className="max-w-6xl mx-auto">
              <TacticalGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {workflowSteps.map((step, index) => (
                  <TacticalGridItem key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <GlassCard className="h-full p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                          <step.icon className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="w-8 h-8 mx-auto mb-4 rounded-full bg-military-hot-pink/20 flex items-center justify-center">
                          <span className="text-military-hot-pink font-bold">{step.step}</span>
                        </div>
                        
                        <h3 className="font-heading text-xl font-bold text-white mb-3">{step.title}</h3>
                        <p className="text-military-storm-grey text-sm leading-relaxed">{step.description}</p>
                      </GlassCard>
                    </motion.div>
                  </TacticalGridItem>
                ))}
              </TacticalGrid>
            </div>
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
                  <Workflow className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="font-heading text-4xl font-bold text-white mb-6">
                  Ready to Automate Your Operations?
                </h2>
                
                <p className="text-xl text-military-storm-grey mb-8 max-w-2xl mx-auto">
                  Deploy tactical workflows that work 24/7 to grow your business. 
                  From lead generation to customer success, automate everything.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <TacticalButton size="lg" className="group">
                    <Workflow className="w-5 h-5 mr-2" />
                    Deploy Workflows
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </TacticalButton>
                  
                  <Link href="/pricing">
                    <TacticalButton variant="outline" size="lg">
                      View Plans
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