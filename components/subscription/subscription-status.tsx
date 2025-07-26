"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useSubscription } from "@/hooks/use-subscription"
import { useAuth } from "@/hooks/use-auth"
import { formatPrice } from "@/lib/stripe"
import { Crown, Zap, Rocket, Calendar, CreditCard, TrendingUp, Database, Users } from "lucide-react"

export function SubscriptionStatus() {
  const {} = useAuth()
  const { currentTier, tierFeatures, isActive, getRemainingStorage, getBillingPortalUrl, isPro, isEmpire, isFree } =
    useSubscription()

  const handleManageBilling = async () => {
    try {
      const url = await getBillingPortalUrl()
      window.location.href = url
    } catch (error) {
      console.error("Failed to open billing portal:", error)
    }
  }

  const getTierIcon = () => {
    if (isEmpire) return Crown
    if (isPro) return Zap
    return Rocket
  }

  const getTierColor = () => {
    if (isEmpire) return "from-yellow-400 to-orange-500"
    if (isPro) return "from-purple-500 to-pink-500"
    return "from-gray-400 to-gray-600"
  }

  const Icon = getTierIcon()
  const colorClass = getTierColor()

  const storageUsed = 0.5 // Mock data - in real app, calculate actual usage
  const storageLimit = tierFeatures.limits.briefcaseStorage
  const storagePercentage = (storageUsed / storageLimit) * 100

  return (
    <Card className="boss-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 bg-gradient-to-r ${colorClass} rounded-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="boss-heading">{tierFeatures.name}</span>
              <Badge className={`bg-gradient-to-r ${colorClass} text-white`}>{isActive ? "Active" : "Inactive"}</Badge>
            </div>
            <p className="text-sm text-gray-600 font-normal">
              {isFree ? "Free forever" : `${formatPrice(tierFeatures.price)}/month`}
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Subscription Details */}
        {!isFree && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">Next Billing</p>
                <p className="text-xs text-gray-600">
                  {profile?.subscription_current_period_end
                    ? new Date(profile.subscription_current_period_end).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
              <CreditCard className="h-5 w-5 text-pink-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">Status</p>
                <p className="text-xs text-gray-600 capitalize">{profile?.subscription_status || "Active"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Usage Stats */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            Usage Overview
          </h4>

          {/* Storage Usage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium flex items-center gap-2">
                <Database className="h-4 w-4 text-gray-600" />
                Briefcase Storage
              </span>
              <span className="text-sm text-gray-600">
                {storageUsed}GB / {storageLimit}GB
              </span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
          </div>

          {/* AI Agents */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600" />
              AI Agents Available
            </span>
            <span className="text-sm text-gray-600">
              {tierFeatures.limits.aiAgents === -1 ? "Unlimited" : tierFeatures.limits.aiAgents}
            </span>
          </div>

          {/* Monthly Tasks */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-gray-600" />
              Monthly Tasks
            </span>
            <span className="text-sm text-gray-600">
              {tierFeatures.limits.monthlyTasks === -1 ? "Unlimited" : `${tierFeatures.limits.monthlyTasks} tasks`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isFree && (
            <Button
              onClick={handleManageBilling}
              variant="outline"
              className="flex-1 bg-transparent border-purple-200 hover:bg-purple-50"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Manage Billing
            </Button>
          )}

          <Button
            onClick={() => (window.location.href = "/pricing")}
            className={`flex-1 bg-gradient-to-r ${colorClass} hover:opacity-90 text-white`}
          >
            {isFree ? "Upgrade Plan" : "Change Plan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
