"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Crown, Zap, Check, X } from "lucide-react"
import { motion } from "framer-motion"

export default function BillingPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Mock subscription data - replace with real data from your billing system
  const subscription = {
    plan: "Free",
    status: "active",
    nextBillingDate: null,
    price: 0,
  }

  const plans = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for getting started",
      features: [
        "5 AI agents",
        "Basic templates",
        "Community support",
        "1 project",
      ],
      limitations: [
        "Limited AI interactions",
        "Basic analytics",
      ],
      current: subscription.plan === "Free",
    },
    {
      name: "Pro",
      price: 29,
      description: "For serious entrepreneurs",
      features: [
        "Unlimited AI agents",
        "Premium templates",
        "Priority support",
        "Unlimited projects",
        "Advanced analytics",
        "Custom branding",
      ],
      limitations: [],
      current: subscription.plan === "Pro",
      popular: true,
    },
    {
      name: "Empire",
      price: 99,
      description: "For empire builders",
      features: [
        "Everything in Pro",
        "White-label solution",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "Advanced automation",
      ],
      limitations: [],
      current: subscription.plan === "Empire",
    },
  ]

  const handleUpgrade = async (planName: string) => {
    setIsLoading(true)
    try {
      // Here you would integrate with your billing system (Stripe, etc.)
      toast({
        title: "Upgrade Initiated",
        description: `Redirecting to upgrade to ${planName} plan...`,
      })
      
      // Simulate redirect to billing system
      setTimeout(() => {
        toast({
          title: "Feature Coming Soon",
          description: "Billing integration is being set up. Contact support for manual upgrades.",
        })
        setIsLoading(false)
      }, 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate upgrade. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access billing</h1>
          <Button asChild>
            <a href="/sign-in">Sign In</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing information
          </p>
        </div>

        {/* Current Plan */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{subscription.plan}</h3>
                <p className="text-muted-foreground">
                  {subscription.price === 0 ? "Free forever" : `$${subscription.price}/month`}
                </p>
                {subscription.nextBillingDate && (
                  <p className="text-sm text-muted-foreground">
                    Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                {subscription.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`relative ${plan.popular ? "border-primary shadow-lg" : ""} ${plan.current ? "ring-2 ring-primary" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  {plan.current && (
                    <div className="absolute -top-3 right-4">
                      <Badge variant="secondary">
                        Current Plan
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {plan.name === "Empire" && <Crown className="h-5 w-5 text-yellow-500" />}
                      {plan.name === "Pro" && <Zap className="h-5 w-5 text-blue-500" />}
                      {plan.name === "Free" && <CreditCard className="h-5 w-5" />}
                      {plan.name}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="text-3xl font-bold">
                      ${plan.price}
                      {plan.price > 0 && <span className="text-lg font-normal text-muted-foreground">/month</span>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.limitations.map((limitation, limitationIndex) => (
                        <div key={limitationIndex} className="flex items-center gap-2">
                          <X className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-full"
                      variant={plan.current ? "outline" : plan.popular ? "default" : "outline"}
                      disabled={plan.current || isLoading}
                      onClick={() => handleUpgrade(plan.name)}
                    >
                      {plan.current ? "Current Plan" : `Upgrade to ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              Your recent billing transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subscription.plan === "Free" ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No billing history</h3>
                <p className="text-muted-foreground">
                  You're currently on the free plan. Upgrade to see your billing history.
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Billing integration coming soon</h3>
                <p className="text-muted-foreground">
                  We're setting up our billing system. Contact support for any billing questions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
