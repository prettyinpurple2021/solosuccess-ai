'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  Crown, 
  Zap, 
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function PricingPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const tiers = [
    {
      id: 'launch',
      name: 'Launch',
      price: 0,
      yearlyPrice: 0,
      description: 'Perfect for ambitious beginners ready to start their empire',
      features: [
        'Access to 2 AI agents (Nova & Echo)',
        '5 AI conversations per day',
        'Basic task automation',
        'Email support',
        'Community access',
        'Mobile app access',
        '1GB file storage',
        '5 goals',
        '20 tasks',
        '3 competitors'
      ],
      limits: {
        aiAgents: 2,
        dailyConversations: 5,
        fileStorage: '1GB',
        goals: 5,
        tasks: 20,
        competitors: 3
      },
      popular: false,
      icon: Zap,
      color: 'text-yellow-500'
    },
    {
      id: 'accelerator',
      name: 'Accelerator',
      price: 19,
      yearlyPrice: 190,
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
        'API access',
        'Unlimited goals & tasks',
        '10 competitors'
      ],
      limits: {
        aiAgents: 8,
        dailyConversations: -1,
        fileStorage: '10GB',
        goals: -1,
        tasks: -1,
        competitors: 10
      },
      popular: true,
      icon: Crown,
      color: 'text-purple-500'
    },
    {
      id: 'dominator',
      name: 'Dominator',
      price: 29,
      yearlyPrice: 290,
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
        'Team collaboration tools',
        'Unlimited everything',
        '5 team members'
      ],
      limits: {
        aiAgents: 8,
        dailyConversations: -1,
        fileStorage: '100GB',
        goals: -1,
        tasks: -1,
        competitors: -1,
        teamMembers: 5
      },
      popular: false,
      icon: Star,
      color: 'text-pink-500'
    }
  ]

  const handleUpgrade = async (tierId: string) => {
    if (tierId === 'launch') {
      toast({
        title: 'Free Plan',
        description: 'You can start using SoloSuccess AI right now with our free Launch plan!',
      })
      return
    }

    setLoading(tierId)
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: tierId,
          billing: billingCycle
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
      setLoading(null)
    }
  }

  const getCurrentPrice = (tier: typeof tiers[0]) => {
    return billingCycle === 'yearly' ? tier.yearlyPrice : tier.price
  }

  const getSavings = (tier: typeof tiers[0]) => {
    if (billingCycle === 'yearly' && tier.price > 0) {
      const monthlyTotal = tier.price * 12
      const yearlyPrice = tier.yearlyPrice
      return monthlyTotal - yearlyPrice
    }
    return 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Choose Your Empire Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Built by a girlboss, for girlbosses. Your AI team is ready to help you dominate your industry.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              aria-label={`Switch to ${billingCycle === 'monthly' ? 'yearly' : 'monthly'} billing`}
              title={`Switch to ${billingCycle === 'monthly' ? 'yearly' : 'monthly'} billing`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <Badge className="bg-green-100 text-green-800">
                Save up to 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier) => {
            const Icon = tier.icon
            const currentPrice = getCurrentPrice(tier)
            const savings = getSavings(tier)
            
            return (
              <Card 
                key={tier.id} 
                className={`relative transition-all duration-300 hover:shadow-xl ${
                  tier.popular 
                    ? 'ring-2 ring-purple-500 shadow-lg scale-105' 
                    : 'hover:shadow-lg'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full bg-gray-100 ${tier.color}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    {tier.description}
                  </CardDescription>
                  
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">
                      ${currentPrice}
                    </span>
                    <span className="text-gray-500">
                      /{billingCycle === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="text-sm text-green-600 font-medium">
                      Save ${savings} per year
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Separator />
                  
                  <Button 
                    className="w-full"
                    size="lg"
                    variant={tier.popular ? 'default' : 'outline'}
                    disabled={loading === tier.id}
                    onClick={() => handleUpgrade(tier.id)}
                  >
                    {loading === tier.id ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {tier.id === 'launch' ? 'Get Started Free' : `Upgrade to ${tier.name}`}
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                  
                  {tier.id === 'launch' && (
                    <p className="text-xs text-center text-gray-500">
                      No credit card required
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Comparison */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Compare All Features
          </h2>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Features
                    </th>
                    {tiers.map((tier) => (
                      <th key={tier.id} className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                        {tier.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      AI Agents
                    </td>
                    {tiers.map((tier) => (
                      <td key={tier.id} className="px-6 py-4 text-center text-sm text-gray-700">
                        {tier.limits.aiAgents === 8 ? 'All 8' : tier.limits.aiAgents}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Daily AI Conversations
                    </td>
                    {tiers.map((tier) => (
                      <td key={tier.id} className="px-6 py-4 text-center text-sm text-gray-700">
                        {tier.limits.dailyConversations === -1 ? 'Unlimited' : tier.limits.dailyConversations}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      File Storage
                    </td>
                    {tiers.map((tier) => (
                      <td key={tier.id} className="px-6 py-4 text-center text-sm text-gray-700">
                        {tier.limits.fileStorage}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Goals & Tasks
                    </td>
                    {tiers.map((tier) => (
                      <td key={tier.id} className="px-6 py-4 text-center text-sm text-gray-700">
                        {tier.limits.goals === -1 ? 'Unlimited' : `${tier.limits.goals} goals, ${tier.limits.tasks} tasks`}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Competitive Intelligence
                    </td>
                    {tiers.map((tier) => (
                      <td key={tier.id} className="px-6 py-4 text-center text-sm text-gray-700">
                        {tier.limits.competitors === -1 ? 'Unlimited' : tier.limits.competitors}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      Support
                    </td>
                    {tiers.map((tier) => (
                      <td key={tier.id} className="px-6 py-4 text-center text-sm text-gray-700">
                        {tier.id === 'launch' ? 'Email' : tier.id === 'accelerator' ? 'Priority' : 'Dedicated'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-2">
                What happens to my data if I cancel?
              </h3>
              <p className="text-gray-600">
                Your data is always yours. If you cancel, you can export all your data, and we'll keep it for 30 days in case you want to reactivate.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment, no questions asked.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Dominate Your Industry?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of girlbosses who are already using SoloSuccess AI to scale their empires.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => handleUpgrade('launch')}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Start Your Free Trial
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}