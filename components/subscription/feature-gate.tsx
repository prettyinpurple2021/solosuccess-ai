"use client"

import type React from "react"

import { useSubscription } from "@/hooks/use-subscription"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Lock } from "lucide-react"
import Link from "next/link"

interface FeatureGateProps {
  tier: "free" | "accelerator" | "dominator"
  children: React.ReactNode
  fallback?: React.ReactNode
  showUpgrade?: boolean
}

export function FeatureGate({ tier, children, fallback, showUpgrade = true }: FeatureGateProps) {
  const { subscription, loading } = useSubscription()

  if (loading) {
    return <div className="animate-pulse bg-gray-200 rounded-lg h-32" />
  }

  const hasAccess = () => {
    if (!subscription) return tier === "free"

    const tierHierarchy = { free: 0, accelerator: 1, dominator: 2 }
    return tierHierarchy[subscription.tier] >= tierHierarchy[tier]
  }

  if (hasAccess()) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  if (!showUpgrade) {
    return null
  }

  return (
    <Card className="border-2 border-dashed border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Lock className="h-5 w-5 text-purple-500" />
          Premium Feature
        </CardTitle>
        <CardDescription>
          Upgrade to {tier === "accelerator" ? "Empire Builder" : "Legendary Boss"} to unlock this feature
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Link href="/pricing">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white">
            <Crown className="mr-2 h-4 w-4" />
            Upgrade Now
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
