'use client'

import { PricingCards} from '@/components/subscription/pricing-cards'
import Link from 'next/link'
import { Button} from '@/components/ui/button'
import { Sparkles} from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Pricing for Solo Founders and Small Business Owners
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Tailored plans for the <strong>Solo Founder</strong>, <strong>Solopreneur</strong>, and <strong>Consultant</strong> who
            want <strong>Business Automation</strong>, <strong>Strategic Planning Tools</strong>, and <strong>AI-powered Productivity</strong>.
          </p>
        </div>

        {/* Pricing Cards */}
        <PricingCards />

        {/* Deep Links to Plan Pages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          <Link href="/pricing/launch" className="block">
            <div className="w-full h-full p-4 rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow transition-all bg-white">
              <div className="text-lg font-semibold text-purple-700">Launch (Free)</div>
              <div className="text-gray-600">Start with AI Business Assistant and basic automation</div>
            </div>
          </Link>
          <Link href="/pricing/accelerator" className="block">
            <div className="w-full h-full p-4 rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow transition-all bg-white">
              <div className="text-lg font-semibold text-purple-700">Accelerator ($19/mo)</div>
              <div className="text-gray-600">Workflow Automation AI and Founder AI Tools</div>
            </div>
          </Link>
          <Link href="/pricing/dominator" className="block">
            <div className="w-full h-full p-4 rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow transition-all bg-white">
              <div className="text-lg font-semibold text-purple-700">Dominator ($29/mo)</div>
              <div className="text-gray-600">Unlimited AI Business Co-pilot and custom workflows</div>
            </div>
          </Link>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Build Your Virtual Team for Founders
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Launch your <strong>Solopreneur Operating System</strong> with our <strong>AI Business Co-pilot</strong>,
              <strong> Founder AI Tools</strong>, and <strong>Workflow Automation AI</strong>.
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