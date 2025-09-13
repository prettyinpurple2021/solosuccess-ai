'use client'

import { PricingCards } from '@/components/subscription/pricing-cards'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export default function PricingPage() {
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
        </div>

        {/* Pricing Cards */}
        <PricingCards />

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
              className="bg-white text-purple-600 hover:bg-gray-100"
              onClick={() => window.location.href = '/signup'}
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