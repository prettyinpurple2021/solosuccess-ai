import "./globals.css"
import type { ReactNode } from 'react'
import Script from 'next/script'
import { Inter as FontSans} from "next/font/google"
import { cn} from "@/lib/utils"
import { ThemeProvider} from "@/components/theme-provider"
import { StackAuthProvider} from "@/components/auth/stack-provider"
import { AuthProvider} from "@/hooks/use-auth"
// import { RecaptchaProvider} from "@/components/recaptcha/recaptcha-provider"
import { PerformanceMonitor } from "@/components/performance/performance-monitor"
import { ServiceWorkerRegister } from "@/components/performance/service-worker-register"
import ExitIntentSurvey from "@/components/marketing/exit-intent-survey"
import { AccessibilityProvider } from "@/components/ui/accessibility"
import { ErrorBoundary } from "@/components/ui/error-handler"
import { ChatProvider } from "@/components/providers/chat-provider"
// Removed GoogleAnalytics component usage; using manual GA4 snippet

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: 'SoloSuccess AI — AI Co-founder for Solo Founders',
  description: 'AI Business Co-pilot and Virtual Team for Founders. Solopreneur Operating System with AI Business Assistant, Startup AI Platform, and Founder AI Tools to scale a one-person business.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SoloSuccess AI',
  },
  keywords: [
    'AI Co-founder',
    'AI Business Co-pilot',
    'Virtual Team for Founders',
    'Solopreneur Operating System',
    'AI Business Assistant',
    'Startup AI Platform',
    'Founder AI Tools',
    'One-Person Business Software',
    'Solo Founder',
    'Solopreneur',
    'Freelancer Tools',
    'Individual Creator',
    'Bootstrapped Founder',
    'E-commerce Entrepreneur',
    'Small Business Owner',
    'Consultant Software',
    'Founder Burnout',
    'Reduce Context Switching',
    'Overcome Decision Fatigue',
    'Scale a Solo Business',
    'Business Automation',
    'Strategic Planning Tools',
    'Streamline Operations',
    'How to Grow a Business Alone',
    'AI Marketing Assistant',
    'AI Sales Strategist',
    'Automated Content Creation',
    'AI for Social Media',
    'Business Intelligence Tools',
    'Workflow Automation AI',
    'AI Executive Assistant',
    'AI-powered Productivity',
  ],
  openGraph: {
    title: 'SoloSuccess AI — AI Co-founder for Solo Founders',
    description: 'Virtual Team for Founders. AI Business Co-pilot and Solopreneur OS to automate workflows, streamline operations, and scale a solo business.',
    type: 'website',
    url: 'https://solosuccess.ai',
    siteName: 'SoloSuccess AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoloSuccess AI — Founder AI Tools',
    description: 'AI Business Assistant, Workflow Automation AI, and AI-powered Productivity for solo founders.',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 0.5,
  userScalable: true,
  themeColor: '#6366f1',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  // GA4 is injected manually; no env var needed
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/images/soloboss-hero-silhouette.jpg" as="image" />
        {/* Search engine verification placeholders */}
        <meta name="google-site-verification" content="CHANGE_ME" />
        <meta name="msvalidate.01" content="CHANGE_ME" />
        <Script id="gtm-base" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?('&l='+l):'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MPXM3ZZT');`}
        </Script>
        {/* Google tag (gtag.js) - exact snippet per instructions */}
        <Script
          id="ga4-gtag-src"
          src="https://www.googletagmanager.com/gtag/js?id=G-W174T4ZFNF"
          strategy="afterInteractive"
          async
        />
        <Script id="ga4-gtag-init" strategy="afterInteractive">
          {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);} 
  gtag('js', new Date());

  gtag('config', 'G-W174T4ZFNF');
          `}
        </Script>
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <link rel="canonical" href="https://solosuccess.ai/" />
        <Script id="ld-org" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'SoloSuccess AI',
            url: 'https://solosuccess.ai/',
            logo: 'https://solosuccess.ai/images/logo.png',
            sameAs: [
              'https://twitter.com/solosuccessai',
              'https://www.linkedin.com/company/solosuccessai'
            ]
          })}
        </Script>
        <Script id="ld-software" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'SoloSuccess AI',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            url: 'https://solosuccess.ai/',
            description: 'AI Co-founder and AI Business Co-pilot for solo founders. Virtual Team for Founders with Solopreneur Operating System.',
            offers: {
              '@type': 'Offer',
              price: 0,
              priceCurrency: 'USD'
            }
          })}
        </Script>
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MPXM3ZZT" height="0" width="0" style="display:none;visibility:hidden"></iframe>',
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StackAuthProvider>
            <AuthProvider>
              <AccessibilityProvider>
                <ChatProvider>
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                </ChatProvider>
                <PerformanceMonitor />
                <ServiceWorkerRegister />
              </AccessibilityProvider>
            </AuthProvider>
          </StackAuthProvider>
        </ThemeProvider>
        <ExitIntentSurvey />
      </body>
    </html>
  )
}
