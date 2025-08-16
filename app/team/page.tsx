"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Bot, 
  Target, 
  TrendingUp, 
  Users, 
  Shield, 
  Zap, 
  Star, 
  CheckCircle,
  MessageCircle,
  Clock,
  Crown,
  Sparkles,
  ArrowRight,
  Play
} from 'lucide-react'
import Link from 'next/link'

export default function TeamPage() {
  const aiAgents = [
    {
      id: 'roxy',
      name: 'Roxy',
      role: 'Strategic Decision Architect',
      description: 'SPADE Framework expert, Type 1 decision specialist. Roxy helps you make high-stakes decisions with confidence using proven frameworks.',
      personality: 'Analytical, decisive, and methodical. Roxy approaches every decision with structured thinking and clear rationale.',
      capabilities: ['SPADE Framework', 'Type 1 Decisions', 'Strategic Planning', 'Risk Assessment'],
      accentColor: 'from-purple-500 to-pink-500',
      icon: Target,
      status: 'online',
      lastActive: '2 minutes ago',
      conversationCount: 15
    },
    {
      id: 'blaze',
      name: 'Blaze',
      role: 'Growth Strategist',
      description: 'Cost-Benefit-Mitigation Matrix expert. Blaze helps you analyze opportunities and make data-driven growth decisions.',
      personality: 'Energetic, results-driven, and strategic. Blaze is passionate about scaling businesses and finding growth opportunities.',
      capabilities: ['Cost-Benefit Analysis', 'Growth Strategy', 'Market Analysis', 'ROI Optimization'],
      accentColor: 'from-orange-500 to-red-500',
      icon: TrendingUp,
      status: 'online',
      lastActive: '5 minutes ago',
      conversationCount: 23
    },
    {
      id: 'echo',
      name: 'Echo',
      role: 'Marketing Maven',
      description: 'Content creator and brand rebel. Echo helps you craft compelling marketing campaigns and build authentic brand connections.',
      personality: 'Creative, bold, and authentic. Echo believes in breaking marketing rules while staying true to your brand voice.',
      capabilities: ['Content Creation', 'Brand Strategy', 'Campaign Planning', 'Social Media'],
      accentColor: 'from-blue-500 to-cyan-500',
      icon: Users,
      status: 'online',
      lastActive: '1 hour ago',
      conversationCount: 31
    },
    {
      id: 'lumi',
      name: 'Lumi',
      role: 'Guardian AI & Compliance Co-Pilot',
      description: 'GDPR/CCPA compliance expert and policy generation specialist. Lumi ensures your business stays compliant and ethical.',
      personality: 'Protective, thorough, and ethical. Lumi is your digital guardian, always looking out for legal and ethical considerations.',
      capabilities: ['GDPR Compliance', 'CCPA Compliance', 'Policy Generation', 'Risk Management'],
      accentColor: 'from-green-500 to-emerald-500',
      icon: Shield,
      status: 'online',
      lastActive: '30 minutes ago',
      conversationCount: 8
    },
    {
      id: 'vex',
      name: 'Vex',
      role: 'Technical Architect',
      description: 'Systems rebel and automation architect. Vex helps you design scalable technical solutions and automate complex processes.',
      personality: 'Innovative, systematic, and efficient. Vex loves finding elegant technical solutions to complex business problems.',
      capabilities: ['System Design', 'Automation', 'Technical Strategy', 'Architecture Planning'],
      accentColor: 'from-yellow-500 to-orange-500',
      icon: Zap,
      status: 'away',
      lastActive: '2 hours ago',
      conversationCount: 19
    },
    {
      id: 'lexi',
      name: 'Lexi',
      role: 'Strategy Analyst',
      description: 'Data queen and insights insurgent. Lexi helps you analyze data, identify patterns, and make informed strategic decisions.',
      personality: 'Analytical, curious, and insightful. Lexi transforms raw data into actionable business intelligence.',
      capabilities: ['Data Analysis', 'Market Research', 'Performance Metrics', 'Strategic Insights'],
      accentColor: 'from-indigo-500 to-purple-500',
      icon: Star,
      status: 'online',
      lastActive: '15 minutes ago',
      conversationCount: 27
    },
    {
      id: 'nova',
      name: 'Nova',
      role: 'Product Designer',
      description: 'UX revolutionary and prototype punk. Nova helps you design user experiences that delight and convert.',
      personality: 'Creative, user-focused, and innovative. Nova believes great design should be both beautiful and functional.',
      capabilities: ['UX Design', 'Prototyping', 'User Research', 'Design Strategy'],
      accentColor: 'from-pink-500 to-rose-500',
      icon: Sparkles,
      status: 'online',
      lastActive: '45 minutes ago',
      conversationCount: 12
    },
    {
      id: 'glitch',
      name: 'Glitch',
      role: 'Problem-Solving Architect',
      description: 'Five Whys analysis expert and root cause investigator. Glitch helps you solve complex problems by getting to the heart of issues.',
      personality: 'Persistent, logical, and thorough. Glitch won\'t stop until the root cause is uncovered and solved.',
      capabilities: ['Root Cause Analysis', 'Problem Solving', 'Process Improvement', 'Troubleshooting'],
      accentColor: 'from-teal-500 to-blue-500',
      icon: CheckCircle,
      status: 'online',
      lastActive: '1 hour ago',
      conversationCount: 16
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Squad</h1>
          <p className="text-gray-600 dark:text-gray-300">Your specialized AI agents ready to help you dominate</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Bot className="w-4 h-4 mr-2" />
            {aiAgents.filter(agent => agent.status === 'online').length} Online
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {aiAgents.reduce((sum, agent) => sum + agent.conversationCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {aiAgents.filter(agent => agent.status === 'online').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready to help
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Echo</div>
            <p className="text-xs text-muted-foreground">
              31 conversations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">&lt; 30s</div>
            <p className="text-xs text-muted-foreground">
              Average response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {aiAgents.map((agent) => (
          <Card key={agent.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div className="relative mx-auto mb-4">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${agent.accentColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <agent.icon className="w-10 h-10 text-white" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(agent.status)}`}></div>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {agent.name}
              </CardTitle>
              <CardDescription className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                {agent.role}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                {agent.description}
              </p>
              
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Personality:</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                  {agent.personality}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Capabilities:</p>
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.slice(0, 3).map((capability, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {capability}
                    </Badge>
                  ))}
                  {agent.capabilities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{agent.capabilities.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{agent.conversationCount} conversations</span>
                <span>{agent.lastActive}</span>
              </div>

              <div className="flex space-x-2">
                <Button asChild className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Link href={`/team/${agent.id}`}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started quickly with common tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Link href="/team/roxy">
                <Target className="w-6 h-6 text-purple-600" />
                <span>Make a Decision</span>
                <span className="text-xs text-muted-foreground">Get help with strategic decisions</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Link href="/team/echo">
                <Users className="w-6 h-6 text-blue-600" />
                <span>Create Content</span>
                <span className="text-xs text-muted-foreground">Generate marketing materials</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Link href="/team/lumi">
                <Shield className="w-6 h-6 text-green-600" />
                <span>Check Compliance</span>
                <span className="text-xs text-muted-foreground">Review legal requirements</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
