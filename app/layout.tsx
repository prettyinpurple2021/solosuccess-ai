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
import { AccessibilityProvider } from "@/components/ui/accessibility"
import { ErrorBoundary } from "@/components/ui/error-handler"
import { ChatProvider } from "@/components/providers/chat-provider"
import { GoogleAnalytics } from "@/components/analytics/google-analytics"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: 'SoloSuccess AI',
  description: 'SoloSuccess AI Platform',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SoloSuccess AI',
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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="gtm-base" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?('&l='+l):'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MPXM3ZZT');`}
        </Script>
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MPXM3ZZT" height="0" width="0" style="display:none;visibility:hidden"></iframe>',
          }}
        />
        {gaId && <GoogleAnalytics measurementId={gaId} />}
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
      </body>
    </html>
  )
}
