"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Crown, Sparkles, Zap, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TIER_FEATURES, formatPrice } from "@/lib/stripe"
import { useAuth } from "@/hooks/use-auth"
import { useSubscription } from "@/hooks/use-subscription"

const tiers = [
  {
    id: "launchpad",
    ...TIER_FEATURES.launchpad,
    icon: Zap,
    popular: false,
    description: "Perfect for getting started with AI-powered productivity",
  },
  {
    id: "accelerator",
    ...TIER_FEATURES.accelerator,
    icon: Sparkles,
    popular: true,
    description: "Everything you need to build your empire with AI",
  },
  {
    id: "dominator",
    ...TIER_FEATURES.dominator,
    icon: Crown,
    popular: false,
    description: "Ultimate power for serious empire builders",
  },
]

export default function PricingPage() {
  const { user } = useAuth()
  const { subscription } = useSubscription()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string | null) => {
    if (!user) {
      // Redirect to auth
      return
    }

    if (!priceId || priceId === "free") {
      // Already on free plan
      return
    }

    setLoading(priceId)

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        console.error("Error creating checkout session:", error)
        return
      }

      // Redirect to Stripe Checkout
      const stripe = (await import("@stripe/stripe-js")).loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

      const stripeInstance = await stripe
      if (stripeInstance) {
        await stripeInstance.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(null)
    }
  }

  const isCurrentPlan = (tierId: string) => {
    return subscription?.tier === tierId
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Choose Your Empire Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the full power of AI to build your business empire. Start free, scale as you grow.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative ${tier.popular ? "scale-105" : ""}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <Card
                className={`h-full ${tier.popular ? "border-2 border-purple-300 shadow-xl" : "border border-gray-200"} ${isCurrentPlan(tier.id) ? "ring-2 ring-purple-500" : ""}`}
              >
                <CardHeader className="text-center pb-8">
                  <div
                    className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${tier.popular ? "from-purple-500 to-pink-500" : "from-gray-400 to-gray-600"} flex items-center justify-center mb-4`}
                  >
                    <tier.icon className="h-6 w-6 text-white" />
                  </div>

                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <CardDescription className="text-gray-600 mt-2">{tier.description}</CardDescription>

                  <div className="mt-4">
                    <div className="text-4xl font-bold">{tier.price === 0 ? "Free" : formatPrice(tier.price)}</div>
                    {tier.price > 0 && <div className="text-gray-500 text-sm">/month</div>}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features List */}
                  <div className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    {isCurrentPlan(tier.id) ? (
                      <Button className="w-full bg-transparent" variant="outline" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        className={`w-full ${tier.popular ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white" : ""}`}
                        variant={tier.popular ? "default" : "outline"}
                        onClick={() => handleSubscribe(tier.priceId)}
                        disabled={loading === tier.priceId}
                      >
                        {loading === tier.priceId
                          ? "Processing..."
                          : tier.price === 0
                            ? "Get Started Free"
                            : `Upgrade to ${tier.name}`}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards through our secure Stripe payment processing.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Is there a money-back guarantee?</h3>
                <p className="text-gray-600">
                  Yes! We offer a 30-day money-back guarantee on all paid plans. No questions asked.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Do you offer discounts for annual billing?</h3>
                <p className="text-gray-600">Annual billing options with significant discounts are coming soon!</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
