import "./globals.css"
import type { ReactNode } from 'react'
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { StackAuthProvider } from "@/components/auth/stack-provider"
import { AuthProvider } from "@/hooks/use-auth"
// import { RecaptchaProvider } from "@/components/recaptcha/recaptcha-provider"
import { PerformanceMonitor } from "@/components/performance/performance-monitor"
import { ServiceWorkerRegister } from "@/components/performance/service-worker-register"
import { AccessibilityProvider } from "@/components/ui/accessibility"
import { ErrorBoundary } from "@/components/ui/error-handler"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: 'SoloBoss AI',
  description: 'SoloBoss AI Platform',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SoloBoss AI',
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StackAuthProvider>
            <AuthProvider>
              <AccessibilityProvider>
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
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
