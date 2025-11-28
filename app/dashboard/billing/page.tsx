"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Loading } from "@/components/ui/loading"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import {
  CreditCard,
  Crown,
  Zap,
  Check,
  X,
  Shield,
  Target,
  Users,
  ArrowRight,
  Star,
  Trophy,
  Clock,
  DollarSign,
  Settings,
  Download,
  AlertTriangle,
  CheckCircle
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
import Link from 'next/link'

export default function BillingPage() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Mock subscription data - replace with real data from your billing system
  const subscription = {
    plan: "Launch",
    status: "active",
    nextBillingDate: null,
    price: 0,
    features: ["2 AI Agents", "5 Daily Conversations", "Basic Templates", "Email Support"]
  }

  const plans = [
    {
      name: "Launch",
      price: 0,
      period: "forever",
      description: "Perfect for getting started with basic AI assistance",
      features: [
        "2 Elite AI Agents",
        "5 Daily Conversations",
        "Basic Template Library",
        "Email Support",
        "Basic Analytics"
      ],
      current: true,
      popular: false,
      color: "from-gray-500 to-gray-600"
    },
    {
      name: "Accelerator",
      price: 19,
      period: "month",
      description: "Advanced features for growing businesses",
      features: [
        "5 Elite AI Agents",
        "100 Daily Conversations",
        "Premium Template Library",
        "Priority Support",
        "Advanced Analytics",
        "Custom Workflows",
        "API Access"
      ],
      current: false,
      popular: true,
      color: "from-military-hot-pink to-military-blush-pink"
    },
    {
      name: "Dominator",
      price: 29,
      period: "month",
      description: "Maximum power for elite entrepreneurs",
      features: [
        "8 Elite AI Agents",
        "Unlimited Conversations",
        "Full Template Library",
        "24/7 Elite Support",
        "Real-time Analytics",
        "Custom AI Training",
        "White-label Options",
        "Dedicated Account Manager"
      ],
      current: false,
      popular: false,
      color: "from-yellow-500 to-orange-500"
    }
  ]

  const billingHistory = [
    {
      id: "inv_001",
      date: "2024-01-15",
      amount: 0,
      status: "paid",
      description: "Launch Plan - Free Tier"
    },
    {
      id: "inv_002",
      date: "2024-01-01",
      amount: 0,
      status: "paid",
      description: "Launch Plan - Free Tier"
    }
  ]

  const handleUpgrade = async (planName: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: "Mission Briefing",
        description: `Upgrading to ${planName} plan. Redirecting to secure checkout...`,
      })
    } catch (error) {
      toast({
        title: "Mission Failed",
        description: "Unable to process upgrade. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to Stripe billing portal
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Command Center Access",
        description: "Redirecting to billing management portal...",
      })
    } catch (error) {
      toast({
        title: "Access Denied",
        description: "Unable to access billing portal. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-military-midnight flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-military-hot-pink border-t-transparent rounded-full animate-spin" />
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
              <Link href="/dashboard" className="flex items-center gap-3">
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
                    Back to Command
                  </TacticalButton>
                </Link>
                <TacticalButton size="sm" onClick={handleManageBilling} disabled={isLoading}>
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Billing
                </TacticalButton>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center gap-2 mb-6">
                <RankStars count={5} size="lg" />
                <span className="text-military-hot-pink font-tactical text-sm uppercase tracking-wider">
                  Elite Command Center
                </span>
              </div>

              <h1 className="font-heading text-5xl font-bold text-white mb-6">
                Tactical <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Billing</span>
              </h1>

              <p className="text-xl text-military-storm-grey max-w-2xl">
                Manage your elite subscription and tactical resources.
                Upgrade your arsenal for maximum business domination.
              </p>
            </motion.div>

            {/* Current Plan */}
            <div className="mb-12">
              <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-heading text-3xl font-bold text-white mb-2">
                      Current Tactical Plan
                    </h2>
                    <p className="text-military-storm-grey">
                      Your active subscription and usage details
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-military-hot-pink mb-1">
                      {subscription.plan}
                    </div>
                    <div className="text-military-storm-grey">
                      {subscription.price === 0 ? 'Free Forever' : `$${subscription.price}/month`}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-white mb-4">Active Features</h3>
                    <div className="space-y-3">
                      {subscription.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-military-storm-grey">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading text-xl font-bold text-white mb-4">Usage Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-military-storm-grey">AI Conversations Today</span>
                        <span className="text-white font-bold">3 / 5</span>
                      </div>
                      <div className="w-full bg-military-tactical/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-military-hot-pink to-military-blush-pink h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-military-storm-grey">Active AI Agents</span>
                        <span className="text-white font-bold">2 / 2</span>
                      </div>
                      <div className="w-full bg-military-tactical/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-military-hot-pink to-military-blush-pink h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Available Plans */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="font-heading text-4xl font-bold text-white mb-4">
                  Elite Upgrade Options
                </h2>
                <p className="text-xl text-military-storm-grey">
                  Choose your tactical advantage level
                </p>
              </div>

              <TacticalGrid className="max-w-6xl mx-auto">
                {plans.map((plan, index) => (
                  <TacticalGridItem key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <GlassCard className={`h-full p-8 relative ${plan.popular ? 'ring-2 ring-military-hot-pink' : ''}`}>
                        {plan.popular && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="bg-gradient-to-r from-military-hot-pink to-military-blush-pink text-white px-4 py-1 rounded-full text-sm font-tactical uppercase tracking-wider">
                              Most Popular
                            </div>
                          </div>
                        )}

                        {plan.current && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1 rounded-full text-sm font-tactical uppercase tracking-wider">
                              Current Plan
                            </div>
                          </div>
                        )}

                        <div className="text-center mb-8">
                          <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                            {plan.name === 'Launch' && <Target className="w-8 h-8 text-white" />}
                            {plan.name === 'Accelerator' && <Zap className="w-8 h-8 text-white" />}
                            {plan.name === 'Dominator' && <Crown className="w-8 h-8 text-white" />}
                          </div>

                          <h3 className="font-heading text-2xl font-bold text-white mb-2">{plan.name}</h3>
                          <p className="text-military-storm-grey mb-4">{plan.description}</p>

                          <div className="mb-6">
                            <span className="text-4xl font-bold text-white">${plan.price}</span>
                            <span className="text-military-storm-grey">/{plan.period}</span>
                          </div>
                        </div>

                        <div className="space-y-4 mb-8">
                          {plan.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-3">
                              <Check className="w-5 h-5 text-green-400" />
                              <span className="text-military-storm-grey">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <TacticalButton
                          className="w-full group"
                          variant={plan.current ? "outline" : "primary"}
                          disabled={plan.current || isLoading}
                          onClick={() => handleUpgrade(plan.name)}
                        >
                          {plan.current ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Current Plan
                            </>
                          ) : (
                            <>
                              {isLoading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  Upgrade to {plan.name}
                                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                              )}
                            </>
                          )}
                        </TacticalButton>
                      </GlassCard>
                    </motion.div>
                  </TacticalGridItem>
                ))}
              </TacticalGrid>
            </div>

            {/* Billing History */}
            <div className="mb-12">
              <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-3xl font-bold text-white">Billing History</h2>
                  <TacticalButton variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </TacticalButton>
                </div>

                <div className="space-y-4">
                  {billingHistory.map((invoice, index) => (
                    <motion.div
                      key={invoice.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-military-tactical/20 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>

                        <div>
                          <p className="text-white font-medium">{invoice.description}</p>
                          <p className="text-military-storm-grey text-sm">{invoice.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-white font-bold">${invoice.amount}</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-sm uppercase tracking-wider">Paid</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Payment Method */}
            <div className="mb-12">
              <GlassCard className="p-8">
                <h2 className="font-heading text-3xl font-bold text-white mb-6">Payment Method</h2>

                <div className="flex items-center justify-between p-4 bg-military-tactical/20 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>

                    <div>
                      <p className="text-white font-medium">No payment method on file</p>
                      <p className="text-military-storm-grey text-sm">Free plan - no payment required</p>
                    </div>
                  </div>

                  <TacticalButton variant="outline" size="sm">
                    Add Payment Method
                  </TacticalButton>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </CamoBackground>
    </div>
  )
}