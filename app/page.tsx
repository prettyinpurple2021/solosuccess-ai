import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  Target, 
  Shield, 
  Zap, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 dark:from-purple-600/10 dark:to-pink-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Productivity Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              SoloBoss AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your productivity with AI agents that work 24/7. Automate everything, achieve more, and dominate your industry like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg">
                <Link href="/dashboard">
                  Start Your Empire
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Your AI Squad
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              8 specialized AI agents with punk rock personalities, each designed to handle specific aspects of your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: 'Roxy',
                role: 'Strategic Decision Architect',
                description: 'SPADE Framework expert, Type 1 decision specialist',
                icon: Target,
                color: 'from-purple-500 to-pink-500'
              },
              {
                name: 'Blaze',
                role: 'Growth Strategist',
                description: 'Cost-Benefit-Mitigation Matrix, strategic analysis',
                icon: TrendingUp,
                color: 'from-orange-500 to-red-500'
              },
              {
                name: 'Echo',
                role: 'Marketing Maven',
                description: 'Content creator, brand rebel',
                icon: Users,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                name: 'Lumi',
                role: 'Guardian AI & Compliance',
                description: 'GDPR/CCPA compliance, policy generation',
                icon: Shield,
                color: 'from-green-500 to-emerald-500'
              },
              {
                name: 'Vex',
                role: 'Technical Architect',
                description: 'Systems rebel, automation architect',
                icon: Zap,
                color: 'from-yellow-500 to-orange-500'
              },
              {
                name: 'Lexi',
                role: 'Strategy Analyst',
                description: 'Data queen, insights insurgent',
                icon: Bot,
                color: 'from-indigo-500 to-purple-500'
              },
              {
                name: 'Nova',
                role: 'Product Designer',
                description: 'UX revolutionary, prototype punk',
                icon: Star,
                color: 'from-pink-500 to-rose-500'
              },
              {
                name: 'Glitch',
                role: 'Problem-Solving Architect',
                description: 'Five Whys analysis, root cause investigation',
                icon: CheckCircle,
                color: 'from-teal-500 to-blue-500'
              }
            ].map((agent) => (
              <Card key={agent.name} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${agent.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <agent.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {agent.name}
                  </CardTitle>
                  <CardDescription className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    {agent.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                    {agent.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your Empire?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of solo founders who are already dominating their industries with AI-powered productivity.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg">
            <Link href="/dashboard">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">SoloBoss AI</h3>
            <p className="text-gray-400 mb-6">
              Built by a punk rock girlboss turned businesswoman who became her own best friend
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
            <div className="mt-8 text-gray-500 text-sm">
              © 2024 SoloBoss AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}