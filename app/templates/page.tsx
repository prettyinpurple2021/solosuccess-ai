"use client"

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { motion } from 'framer-motion'
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
  Filter,
  Lightbulb,
  UserCog,
  type LucideIcon
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
import {
  templateCategories,
  templateList,
  type TemplateCategoryRecord,
  type TemplateSummary,
} from '@/lib/template-catalog'
const categoryIconMap: Record<string, LucideIcon> = {
  Target,
  TrendingUp,
  Briefcase,
  Sparkles,
  Users,
  Focus,
  Brain,
  Filter,
  Lightbulb,
  UserCog,
}

export default function TemplatesPage() {
  const categories: TemplateCategoryRecord[] = templateCategories
  const featuredTemplates: TemplateSummary[] = templateList.slice(0, 6)

  const getDifficultyColor = (difficulty: TemplateSummary['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400'
      case 'intermediate': return 'text-yellow-400'
      case 'advanced': return 'text-red-400'
      default: return 'text-military-storm-grey'
    }
  }

  const getDifficultyIcon = (difficulty: TemplateSummary['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return <Target className="w-4 h-4" />
      case 'intermediate': return <Shield className="w-4 h-4" />
      case 'advanced': return <Sword className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
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
                  Elite Template Arsenal
                </span>
              </div>
              
              <h1 className="font-heading text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Tactical <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Templates</span>
              </h1>
              
              <p className="text-2xl text-military-storm-grey max-w-3xl mx-auto mb-8 leading-relaxed">
                Deploy battle-tested templates for every aspect of your business. 
                From strategic planning to content creation, dominate your goals with proven frameworks.
              </p>
              
              <TacticalButton size="lg" className="group">
                <Rocket className="w-5 h-5 mr-2" />
                Deploy Templates
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </TacticalButton>
            </motion.div>
          </div>
        </div>

        {/* Template Categories */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-5xl font-bold text-white mb-6">
                Template <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Categories</span>
              </h2>
              <p className="text-xl text-military-storm-grey max-w-2xl mx-auto">
                Organized by tactical function for maximum efficiency
              </p>
            </motion.div>

            <TacticalGrid className="max-w-7xl mx-auto">
              {categories.map((category, index) => {
                const CategoryIcon = categoryIconMap[category.icon] ?? Target

                return (
                  <TacticalGridItem key={category.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <GlassCard className="h-full p-8">
                        <div className="text-center mb-6">
                          <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                            <CategoryIcon className="w-10 h-10 text-white" />
                          </div>

                          <h3 className="font-heading text-2xl font-bold text-white mb-2">{category.name}</h3>
                          <p className="text-military-storm-grey mb-4">{category.description}</p>

                          <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="text-military-hot-pink font-tactical text-sm uppercase tracking-wider">
                              {category.templates.length} Templates
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {category.templates.slice(0, 3).map((template, templateIndex) => (
                            <div key={template.slug} className="flex items-center gap-3 p-3 bg-military-tactical/20 rounded-lg">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                                <span className="text-white font-bold text-xs">{templateIndex + 1}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-white font-medium text-sm">{template.title}</h4>
                                <p className="text-military-storm-grey text-xs">{template.description}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                {getDifficultyIcon(template.difficulty)}
                                <span className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                                  {template.difficulty}
                                </span>
                              </div>
                            </div>
                          ))}

                          {category.templates.length > 3 && (
                            <div className="text-center">
                              <span className="text-military-storm-grey text-sm">
                                +{category.templates.length - 3} more templates
                              </span>
                            </div>
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  </TacticalGridItem>
                )
              })}
            </TacticalGrid>
          </div>
        </div>

        {/* Featured Templates */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-5xl font-bold text-white mb-6">
                Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Templates</span>
              </h2>
              <p className="text-xl text-military-storm-grey max-w-2xl mx-auto">
                Battle-tested templates used by successful entrepreneurs
              </p>
            </motion.div>

            <div className="max-w-6xl mx-auto">
              <TacticalGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {featuredTemplates.map((template, index) => (
                  <TacticalGridItem key={template.slug}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <GlassCard className="h-full p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {getDifficultyIcon(template.difficulty)}
                            <span className={`text-sm font-tactical uppercase tracking-wider ${getDifficultyColor(template.difficulty)}`}>
                              {template.difficulty}
                            </span>
                          </div>
                          
                          {template.isAiGenerated && (
                            <div className="flex items-center gap-1">
                              <Sparkles className="w-4 h-4 text-military-hot-pink" />
                              <span className="text-military-hot-pink text-xs font-tactical uppercase">AI</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-heading text-xl font-bold text-white mb-3">{template.title}</h3>
                        <p className="text-military-storm-grey mb-4 text-sm leading-relaxed">{template.description}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-military-storm-grey" />
                            <span className="text-military-storm-grey text-sm">{template.estimatedTime}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-military-storm-grey text-sm">4.8</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {template.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-1 bg-military-hot-pink/20 text-military-hot-pink text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <TacticalButton size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            View Template
                          </TacticalButton>
                          <TacticalButton variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </TacticalButton>
                        </div>
                      </GlassCard>
                    </motion.div>
                  </TacticalGridItem>
                ))}
              </TacticalGrid>
            </div>
          </div>
        </div>

        {/* AI-Generated Templates */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-heading text-5xl font-bold text-white mb-6">
                AI-Generated <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Templates</span>
              </h2>
              <p className="text-xl text-military-storm-grey max-w-2xl mx-auto">
                Custom templates generated by our elite AI agents for your specific needs
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <GlassCard className="p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="font-heading text-3xl font-bold text-white mb-4">
                    Custom Template Generation
                  </h3>
                  
                  <p className="text-xl text-military-storm-grey mb-8 leading-relaxed">
                    Our AI agents can create personalized templates based on your industry, 
                    business stage, and specific requirements. Get templates tailored to your exact needs.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-heading text-xl font-bold text-white mb-4">AI Capabilities:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-military-storm-grey">Industry-specific templates</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-military-storm-grey">Custom business stage adaptation</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-military-storm-grey">Personalized content generation</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-military-storm-grey">Real-time template optimization</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-heading text-xl font-bold text-white mb-4">Generation Process:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-military-hot-pink/20 flex items-center justify-center">
                          <span className="text-military-hot-pink font-bold text-xs">1</span>
                        </div>
                        <span className="text-military-storm-grey text-sm">Define your requirements</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-military-hot-pink/20 flex items-center justify-center">
                          <span className="text-military-hot-pink font-bold text-xs">2</span>
                        </div>
                        <span className="text-military-storm-grey text-sm">AI analyzes your needs</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-military-hot-pink/20 flex items-center justify-center">
                          <span className="text-military-hot-pink font-bold text-xs">3</span>
                        </div>
                        <span className="text-military-storm-grey text-sm">Generate custom template</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-military-hot-pink/20 flex items-center justify-center">
                          <span className="text-military-hot-pink font-bold text-xs">4</span>
                        </div>
                        <span className="text-military-storm-grey text-sm">Deploy and customize</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-8">
                  <TacticalButton size="lg" className="group">
                    <Brain className="w-5 h-5 mr-2" />
                    Generate Custom Template
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </TacticalButton>
                </div>
              </GlassCard>
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
                  <Rocket className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="font-heading text-4xl font-bold text-white mb-6">
                  Ready to Deploy Your Template Arsenal?
                </h2>
                
                <p className="text-xl text-military-storm-grey mb-8 max-w-2xl mx-auto">
                  Access hundreds of battle-tested templates and generate custom ones with AI. 
                  Your business success starts with the right frameworks.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <TacticalButton size="lg" className="group">
                    <Rocket className="w-5 h-5 mr-2" />
                    Access Templates
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