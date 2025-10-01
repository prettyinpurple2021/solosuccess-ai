import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import FaqSection from '@/components/faq/faq-section'

export const metadata: Metadata = {
  title: 'Dominator Plan — Unlimited AI Business Co-pilot for Empire Builders',
  description: 'Unlimited AI agents, custom workflows, and white-label options. For empire builders who demand unlimited power with AI Business Assistant and Workflow Automation AI.',
  alternates: {
    canonical: 'https://solobossai.fun/pricing/dominator',
  },
  openGraph: {
    title: 'Dominator Plan — Unlimited AI Business Co-pilot',
    description: 'Unlimited plan with AI Business Co-pilot, custom workflows, and white-label options.',
    url: 'https://solobossai.fun/pricing/dominator',
    type: 'website',
    siteName: 'SoloSuccess AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dominator Plan — Unlimited AI Business Co-pilot',
    description: 'Unlimited AI Business Co-pilot with custom workflows for empire builders.',
  },
}

export const runtime = 'edge'

export default function DominatorPlanPage() {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Dominator Plan',
    description: 'Unlimited AI Business Co-pilot plan with custom workflows for empire builders and large businesses.',
    brand: { '@type': 'Brand', name: 'SoloSuccess AI' },
    offers: {
      '@type': 'Offer',
      price: '29',
      priceCurrency: 'USD',
      url: 'https://solobossai.fun/contact',
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
      { '@type': 'ListItem', position: 3, name: 'Dominator Plan', item: 'https://solobossai.fun/pricing/dominator' },
    ],
  }

  return (
    <>
      <Script id="ld-product-dominator" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(productSchema)}
      </Script>
      <Script id="ld-breadcrumbs-dominator" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-red-500 to-orange-500 text-white">
              👑 Unlimited Power
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Dominator Plan
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              For empire builders who demand unlimited power with <strong>AI Business Co-pilot</strong>, 
+              <strong> Workflow Automation AI</strong>, and <strong>AI Executive Assistant</strong> capabilities 
+              to <strong>Scale a Solo Business</strong> without limits.
            </p>
          </div>

          {/* Plan Card */}
          <div className="max-w-2xl mx-auto mb-16">
            <Card className="border-2 border-red-200 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900">Dominator</CardTitle>
                <div className="text-5xl font-bold text-red-600 mb-4">
                  $29<span className="text-lg text-gray-600">/month</span>
                </div>
                <CardDescription className="text-lg text-gray-600">
                  For empire builders who demand unlimited power
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  {[
                    'Access to all 8 AI agents (Nova, Echo, Atlas, Luna, Phoenix, Orion, Vega, Nova)',
                    'Unlimited AI conversations',
                    'Advanced automation + custom workflows',
                    '24/7 priority support + phone support',
                    'Advanced analytics + custom reports',
                    'Unlimited integrations',
                    'White-label options',
                    'Unlimited team members',
                    'API access',
                    'Custom AI agent training',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-sm text-gray-500 mb-6">
                  Built for <strong>E-commerce Entrepreneurs</strong> and <strong>Small Business Owners</strong> 
+                  who need <strong>Business Intelligence Tools</strong> and <strong>AI Marketing Assistant</strong> 
+                  + <strong>AI Sales Strategist</strong> at scale.
                </div>
                <Link href="/contact">
                  <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg py-4">
                    Contact Sales
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
                Ready to Build Your Solopreneur Operating System?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join elite <strong>Bootstrapped Founders</strong> using our complete <strong>Virtual Team for Founders</strong> 
+                with <strong>Automated Content Creation</strong> and <strong>AI for Social Media</strong>.
              </p>
              <Link href="/contact">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* FAQs */}
      <FaqSection
        id="faq-dominator-plan"
        title="Dominator Plan FAQs"
        items={[
          { question: 'Who is Dominator for?', answer: 'Founders who need unlimited scale, custom workflows, and white‑label options.' },
          { question: 'Do you offer support SLAs?', answer: 'Yes, Dominator includes 24/7 priority and phone support.' },
          { question: 'Can I request custom features?', answer: 'We offer bespoke solutions and API access—contact sales to scope.' },
        ]}
      />
    </>
  )
}
