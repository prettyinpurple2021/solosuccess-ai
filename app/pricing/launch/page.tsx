import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import FaqSection from '@/components/faq/faq-section'

export const metadata: Metadata = {
  title: 'Launch Plan — Free AI Co-founder for Solo Founders',
  description: 'Start free with AI Business Assistant, basic automation, and community access. Perfect for Solo Founders, Solopreneurs, and Individual Creators getting started.',
  alternates: {
    canonical: 'https://solobossai.fun/pricing/launch',
  },
  openGraph: {
    title: 'Launch Plan — Free AI Co-founder',
    description: 'Free plan for Solo Founders with AI Business Assistant and basic automation.',
    url: 'https://solobossai.fun/pricing/launch',
    type: 'website',
    siteName: 'SoloSuccess AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Launch Plan — Free AI Co-founder',
    description: 'Start free with AI Business Assistant for Solo Founders.',
  },
}

export default function LaunchPlanPage() {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Launch Plan',
    description: 'Free AI Co-founder plan for Solo Founders, Solopreneurs, and Individual Creators.',
    brand: { '@type': 'Brand', name: 'SoloSuccess AI' },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      url: 'https://solobossai.fun/signup',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2025-12-31',
    },
    category: 'Software',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://solobossai.fun/' },
      { '@type': 'ListItem', position: 2, name: 'Pricing', item: 'https://solobossai.fun/pricing' },
      { '@type': 'ListItem', position: 3, name: 'Launch Plan', item: 'https://solobossai.fun/pricing/launch' },
    ],
  }

  return (
    <>
      <Script id="ld-product-launch" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(productSchema)}
      </Script>
      <Script id="ld-breadcrumbs-launch" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              🚀 Free Forever
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Launch Plan
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Perfect for <strong>Solo Founders</strong>, <strong>Solopreneurs</strong>, and <strong>Individual Creators</strong> 
              just starting their journey with <strong>AI-powered Productivity</strong>.
            </p>
          </div>

          {/* Plan Card */}
          <div className="max-w-2xl mx-auto mb-16">
            <Card className="border-2 border-green-200 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900">Launch</CardTitle>
                <div className="text-5xl font-bold text-green-600 mb-4">
                  $0<span className="text-lg text-gray-600">/month</span>
                </div>
                <CardDescription className="text-lg text-gray-600">
                  Perfect for ambitious beginners ready to start their empire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  {[
                    'Access to 2 AI agents (Nova & Echo)',
                    '5 AI conversations per day',
                    'Basic task automation',
                    'Email support',
                    'Community access',
                    'Mobile app access',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-sm text-gray-500 mb-6">
                  Ideal for <strong>Freelancer Tools</strong> users and <strong>Bootstrapped Founders</strong> 
                  exploring <strong>AI Business Assistant</strong> capabilities.
                </div>
                <Link href="/signup">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg py-4">
                    Start Free Forever
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Meet Your AI Co-founder?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of <strong>Solo Founders</strong> using our <strong>AI Business Co-pilot</strong> 
                to build their <strong>Solopreneur Operating System</strong>.
              </p>
              <Link href="/signup">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Start Your Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* FAQs */}
      <FaqSection
        id="faq-launch-plan"
        title="Launch Plan FAQs"
        items={[
          { question: 'Is Launch really free?', answer: 'Yes. It is free forever with no credit card required.' },
          { question: 'What do I get on Launch?', answer: 'Core AI assistants, basic automation, and community access to get started.' },
          { question: 'Can I upgrade later?', answer: 'Anytime. Your data and settings carry over when you upgrade.' },
        ]}
      />
    </>
  )
}
