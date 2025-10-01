"use client"


export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HolographicCard } from '@/components/ui/holographic-card'
import { HolographicButton } from '@/components/ui/holographic-button'
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
  Eye
} from 'lucide-react'
import templateData from '@/data/templates.json'

type TemplateCategory = {
  id: string
  category: string
  icon: string
  description: string
  templates: Array<{
    id: string
    title: string
    description: string
    slug: string
    isInteractive: boolean
    requiredRole: string
  }>
}

export default function TemplatesPage() {
  const categories = templateData as TemplateCategory[]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 to-black text-white">
      <nav className="border-b border-purple-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-purple-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/pricing" className="text-purple-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <HolographicButton size="sm">
                <Crown className="w-4 h-4 mr-2" />
                Get Started
              </HolographicButton>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
              AI-Powered Boss Templates
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Transform your solo business into an empire with our curated collection of AI-enhanced templates. 
              From business planning to marketing strategies - everything you need to scale faster! 🚀
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                <Crown className="w-4 h-4 mr-2" /> 50+ Premium Templates
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                <Zap className="w-4 h-4 mr-2" /> AI-Powered Generation
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" /> Updated Weekly
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <HolographicButton size="lg" className="text-lg px-8 py-4">
                <Play className="w-5 h-5 mr-2" />
                See Templates in Action
              </HolographicButton>
              <HolographicButton variant="outline" size="lg" className="text-lg px-8 py-4">
                <Download className="w-5 h-5 mr-2" />
                Download Free Sample
              </HolographicButton>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 text-gradient">Why Solo Entrepreneurs Love Our Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <HolographicCard>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Intelligence</h3>
                <p className="text-purple-200">Our templates use AI to adapt to your industry, stage, and specific needs</p>
              </CardContent>
            </HolographicCard>
            <HolographicCard>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Save 10+ Hours Weekly</h3>
                <p className="text-purple-200">Skip the research and planning - jump straight into execution</p>
              </CardContent>
            </HolographicCard>
            <HolographicCard>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Proven Results</h3>
                <p className="text-purple-200">Used by 10,000+ entrepreneurs who&apos;ve grown their businesses 3x faster</p>
              </CardContent>
            </HolographicCard>
          </div>
        </motion.div>

        {/* Template Categories Showcase */}
        <div className="space-y-12">
          {categories.slice(0, 2).map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{category.category}</h2>
                  <p className="text-purple-200">{category.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.templates.slice(0, 3).map((template, templateIndex) => (
                  <motion.div
                    key={templateIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: templateIndex * 0.1 }}
                  >
                    <HolographicCard className="h-full group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg text-white group-hover:text-cyan-300 transition-colors">
                            {template.title}
                          </CardTitle>
                          <Badge 
                            variant="secondary" 
                            className="bg-purple-700 text-white text-xs"
                          >
                            {template.requiredRole === 'free_launchpad' ? 'Free' : 
                             template.requiredRole === 'pro_accelerator' ? 'Pro' : 'Premium'}
                          </Badge>
                        </div>
                        <CardDescription className="text-purple-200 text-sm">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-xs text-purple-300">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>15-30 min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>1,200+ users</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            <span>4.9/5</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <HolographicButton size="sm" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </HolographicButton>
                          <Button variant="outline" size="sm" className="text-purple-200 border-purple-700">
                            <Star className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </HolographicCard>
                  </motion.div>
                ))}
              </div>
              {category.templates.length > 3 && (
                <div className="text-center mt-6">
                  <HolographicButton variant="outline">
                    View All {category.templates.length} Templates
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </HolographicButton>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-24 text-center"
        >
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-12 border border-purple-700">
            <h2 className="text-4xl font-bold mb-6 text-gradient">
              Ready to Accelerate Your Business? 🚀
            </h2>
            <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of solo entrepreneurs who&apos;ve already transformed their businesses 
              with our AI-powered templates. Start your empire-building journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center gap-2 text-purple-300">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>50+ Premium Templates</span>
              </div>
              <div className="flex items-center gap-2 text-purple-300">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>AI-Powered Customization</span>
              </div>
              <div className="flex items-center gap-2 text-purple-300">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>24/7 Support</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <HolographicButton size="lg" className="text-lg px-8 py-4" asChild>
                <Link href="/pricing">
                  <Crown className="w-5 h-5 mr-2" />
                  Start Your Free Trial
                </Link>
              </HolographicButton>
              <HolographicButton variant="outline" size="lg" className="text-lg px-8 py-4" asChild>
                <Link href="/dashboard">
                  <Eye className="w-5 h-5 mr-2" />
                  View All Templates
                </Link>
              </HolographicButton>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


