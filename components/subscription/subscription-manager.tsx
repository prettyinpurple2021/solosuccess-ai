'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  Crown, 
  Zap, 
  Star,
  ArrowRight,
  CreditCard,
  Calendar,
  Users,
  FileText,
  Bot,
  Target,
  Shield,
  BarChart3,
  Settings
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

interface SubscriptionTier {
  id: string
  name: string
  price: number
  period: string
  yearlyPrice?: number
  yearlyPeriod?: string
  description: string
  features: string[]
  limits: {
    aiAgents: number
    dailyConversations: number
    fileStorage: string
    goals: number
    tasks: number
    competitors: number
    templates: number
    teamMembers?: number
  }
  popular: boolean
}

interface UserSubscription {
  tier: string
  status: string
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  stripeCustomerId?: string
}

export function SubscriptionManager() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [usage, setUsage] = useState({
    aiConversations: 0,
    fileStorage: 0,
    goals: 0,
    tasks: 0,
    competitors: 0,
    templates: 0
  })

  const tiers: SubscriptionTier[] = [
    {
      id: 'launch',
      name: 'Launch',
      price: 0,
      period: 'month',
      description: 'Perfect for ambitious beginners ready to start their empire',
      features: [
        'Access to 2 AI agents (Nova & Echo)',
        '5 AI conversations per day',
        'Basic task automation',
        'Email support',
        'Community access',
        'Mobile app access'
      ],
      limits: {
        aiAgents: 2,
        dailyConversations: 5,
        fileStorage: '1GB',
        goals: 5,
        tasks: 20,
        competitors: 3,
        templates: 5
      },
      popular: false
    },
    {
      id: 'accelerator',
      name: 'Accelerator',
      price: 19,
      period: 'month',
      yearlyPrice: 190,
      yearlyPeriod: 'year',
      description: 'For solo founders ready to scale their empire',
      features: [
        'Access to all 8 AI agents',
        'Unlimited AI conversations',
        'Advanced automation',
        'Priority support',
        'Advanced analytics',
        'File management (10GB)',
        'Competitive intelligence',
        'Guardian AI compliance',
        'Template library access',
        'API access'
      ],
      limits: {
        aiAgents: 8,
        dailyConversations: -1, // Unlimited
        fileStorage: '10GB',
        goals: -1, // Unlimited
        tasks: -1, // Unlimited
        competitors: 10,
        templates: -1 // Unlimited
      },
      popular: true
    },
    {
      id: 'dominator',
      name: 'Dominator',
      price: 29,
      period: 'month',
      yearlyPrice: 290,
      yearlyPeriod: 'year',
      description: 'For empire builders who demand the best',
      features: [
        'Everything in Accelerator',
        'White-label options',
        'Advanced API access',
        'Custom integrations',
        'File management (100GB)',
        'Priority feature requests',
        'Dedicated support',
        'Advanced analytics',
        'Custom workflows',
        'Team collaboration tools'
      ],
      limits: {
        aiAgents: 8,
        dailyConversations: -1, // Unlimited
        fileStorage: '100GB',
        goals: -1, // Unlimited
        tasks: -1, // Unlimited
        competitors: -1, // Unlimited
        templates: -1, // Unlimited
        teamMembers: 5
      },
      popular: false
    }
  ]

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      // Fetch user subscription and usage data
      // This would typically come from your API
      const response = await fetch('/api/subscription')
      if (response.ok) {
        const data = await response.json()
        setSubscription(data.subscription)
        setUsage(data.usage)
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error)
    }
  }

  const handleUpgrade = async (tierId: string, billing: 'monthly' | 'yearly' = 'monthly') => {
    if (tierId === 'launch') {
      toast({
        title: 'Already on Launch Plan',
        description: 'You are currently on the free Launch plan.',
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: tierId,
          billing: billing
        })
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error)
      toast({
        title: 'Upgrade Failed',
        description: 'There was an error processing your upgrade. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleManageBilling = async () => {
    if (!subscription?.stripeCustomerId) {
      toast({
        title: 'No Billing Information',
        description: 'No billing information found for your account.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/stripe/billing-portal', {
        method: 'POST'
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        throw new Error('Failed to create billing portal session')
      }
    } catch (error) {
      console.error('Error opening billing portal:', error)
      toast({
        title: 'Billing Portal Error',
        description: 'There was an error opening the billing portal. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getCurrentTier = () => {
    return tiers.find(tier => tier.id === subscription?.tier) || tiers[0]
  }

  const getUsagePercentage = (current: number, limit: number | string) => {
    if (limit === -1 || limit === 'unlimited') return 0
    const limitNum = typeof limit === 'string' ? parseInt(limit) : limit
    return Math.min((current / limitNum) * 100, 100)
  }

  const formatStorage = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024)
    return `${gb.toFixed(2)} GB`
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription>
            Manage your SoloSuccess AI subscription and billing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{getCurrentTier().name} Plan</h3>
              <p className="text-sm text-muted-foreground">
                {subscription?.status === 'active' ? 'Active' : 'Inactive'}
              </p>
            </div>
            <Badge variant={subscription?.status === 'active' ? 'default' : 'secondary'}>
              {subscription?.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {subscription?.status === 'active' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Current period</span>
                <span>
                  {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {' '}
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
              {subscription.cancelAtPeriodEnd && (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <Calendar className="h-4 w-4" />
                  <span>Subscription will cancel at the end of the current period</span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={handleManageBilling}
              disabled={loading || !subscription?.stripeCustomerId}
              variant="outline"
              className="flex-1"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Manage Billing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Usage Overview
          </CardTitle>
          <CardDescription>
            Your current usage across all features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  AI Conversations
                </span>
                <span>
                  {usage.aiConversations} / {getCurrentTier().limits.dailyConversations === -1 ? '∞' : getCurrentTier().limits.dailyConversations}
                </span>
              </div>
              {getCurrentTier().limits.dailyConversations !== -1 && (
                <Progress 
                  value={getUsagePercentage(usage.aiConversations, getCurrentTier().limits.dailyConversations)} 
                  className="h-2" 
                />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  File Storage
                </span>
                <span>
                  {formatStorage(usage.fileStorage)} / {getCurrentTier().limits.fileStorage}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(usage.fileStorage, getCurrentTier().limits.fileStorage)} 
                className="h-2" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Goals
                </span>
                <span>
                  {usage.goals} / {getCurrentTier().limits.goals === -1 ? '∞' : getCurrentTier().limits.goals}
                </span>
              </div>
              {getCurrentTier().limits.goals !== -1 && (
                <Progress 
                  value={getUsagePercentage(usage.goals, getCurrentTier().limits.goals)} 
                  className="h-2" 
                />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Tasks
                </span>
                <span>
                  {usage.tasks} / {getCurrentTier().limits.tasks === -1 ? '∞' : getCurrentTier().limits.tasks}
                </span>
              </div>
              {getCurrentTier().limits.tasks !== -1 && (
                <Progress 
                  value={getUsagePercentage(usage.tasks, getCurrentTier().limits.tasks)} 
                  className="h-2" 
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <Card key={tier.id} className={`relative ${tier.popular ? 'ring-2 ring-purple-500' : ''}`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {tier.id === 'launch' && <Zap className="h-5 w-5" />}
                  {tier.id === 'accelerator' && <Crown className="h-5 w-5" />}
                  {tier.id === 'dominator' && <Star className="h-5 w-5" />}
                  {tier.name}
                </CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    ${tier.price}
                  </span>
                  <span className="text-muted-foreground">/{tier.period}</span>
                </div>
                {tier.yearlyPrice && (
                  <div className="text-sm text-muted-foreground">
                    or ${tier.yearlyPrice}/{tier.yearlyPeriod} (save 17%)
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Separator />
                
                <div className="space-y-2">
                  <Button 
                    className="w-full"
                    variant={tier.id === subscription?.tier ? 'outline' : 'default'}
                    disabled={loading || tier.id === subscription?.tier}
                    onClick={() => handleUpgrade(tier.id)}
                  >
                    {tier.id === subscription?.tier ? 'Current Plan' : `Upgrade to ${tier.name}`}
                    {tier.id !== subscription?.tier && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                  
                  {tier.yearlyPrice && tier.id !== subscription?.tier && (
                    <Button 
                      className="w-full"
                      variant="outline"
                      disabled={loading}
                      onClick={() => handleUpgrade(tier.id, 'yearly')}
                    >
                      Save 17% with Yearly
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}