import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import FaqSection from '@/components/faq/faq-section'

export const metadata: Metadata = {
  title: 'Accelerator Plan — AI Business Co-pilot for Growing Founders',
  description: 'Scale with 5 AI agents, advanced automation, and team collaboration. Perfect for growing Solo Founders, Small Business Owners, and E-commerce Entrepreneurs.',
  alternates: {
    canonical: 'https://solobossai.fun/pricing/accelerator',
  },
  openGraph: {
    title: 'Accelerator Plan — AI Business Co-pilot',
    description: 'Growth plan with Workflow Automation AI and Founder AI Tools for scaling businesses.',
    url: 'https://solobossai.fun/pricing/accelerator',
    type: 'website',
    siteName: 'SoloSuccess AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Accelerator Plan — AI Business Co-pilot',
    description: 'Scale your business with AI Business Co-pilot and advanced automation.',
  },
}

// Edge Runtime disabled due to Node.js dependency incompatibility

export default function AcceleratorPlanPage() {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Accelerator Plan',
    description: 'AI Business Co-pilot plan with advanced automation for growing Solo Founders and Small Business Owners.',
    brand: { '@type': 'Brand', name: 'SoloSuccess AI' },
    offers: {
      '@type': 'Offer',
      price: '19',
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
      { '@type': 'ListItem', position: 3, name: 'Accelerator Plan', item: 'https://solobossai.fun/pricing/accelerator' },
    ],
  }

  return (
    <>
      <Script id="ld-product-accelerator" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(productSchema)}
      </Script>
      <Script id="ld-breadcrumbs-accelerator" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              ⚡ Most Popular
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Accelerator Plan
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              For growing <strong>Solo Founders</strong>, <strong>Small Business Owners</strong>, and 
              <strong> E-commerce Entrepreneurs</strong> who need <strong>Business Automation</strong> and 
              <strong> Strategic Planning Tools</strong> to <strong>Scale a Solo Business</strong>.
            </p>
          </div>

          {/* Plan Card */}
          <div className="max-w-2xl mx-auto mb-16">
            <Card className="border-2 border-purple-300 shadow-xl scale-105">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900">Accelerator</CardTitle>
                <div className="text-5xl font-bold text-purple-600 mb-4">
                  $19<span className="text-lg text-gray-600">/month</span>
                </div>
                <CardDescription className="text-lg text-gray-600">
                  For growing boss babes scaling their operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  {[
                    'Access to 5 AI agents (Nova, Echo, Vex, Lumi, Glitch)',
                    '100 AI conversations per day',
                    'Advanced automation workflows',
                    'Priority email support',
                    'Analytics dashboard',
                    'Integration with 50+ tools',
                    'Custom branding options',
                    'Team collaboration (up to 3 members)',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-sm text-gray-500 mb-6">
                  Perfect for <strong>Consultant Software</strong> users and <strong>Small Business Owners</strong> 
+                  who want to <strong>Streamline Operations</strong> and <strong>Reduce Context Switching</strong>.
                </div>
                <Link href="/signup">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg py-4">
                    Get Started
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
                Ready to Build Your Virtual Team for Founders?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of <strong>Solopreneurs</strong> using our <strong>AI Business Co-pilot</strong> 
+                and <strong>Workflow Automation AI</strong> to <strong>Overcome Decision Fatigue</strong>.
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
        id="faq-accelerator-plan"
        title="Accelerator Plan FAQs"
        items={[
          { question: 'Who is Accelerator for?', answer: 'Growing founders needing more automation, analytics, and collaboration.' },
          { question: 'Is there a trial?', answer: 'You can start on Launch and upgrade anytime—no lock‑in.' },
          { question: 'Can I add team members?', answer: 'Yes, Accelerator supports small teams (up to 3).' },
        ]}
      />
    </>
  )
}
