import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { AppSidebar } from '@/components/app-sidebar'
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SoloBoss AI - Transform Your Productivity',
  description: 'AI-powered productivity platform for solo founders and entrepreneurs. Automate everything, achieve more, and dominate your industry.',
  keywords: 'AI, productivity, automation, solo founder, entrepreneur, business tools',
  authors: [{ name: 'SoloBoss AI Team' }],
  creator: 'SoloBoss AI',
  publisher: 'SoloBoss AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://soloboss.ai'),
  openGraph: {
    title: 'SoloBoss AI - Transform Your Productivity',
    description: 'AI-powered productivity platform for solo founders and entrepreneurs.',
    url: 'https://soloboss.ai',
    siteName: 'SoloBoss AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SoloBoss AI Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoloBoss AI - Transform Your Productivity',
    description: 'AI-powered productivity platform for solo founders and entrepreneurs.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen overflow-hidden">
            <AppSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <main className="flex-1 overflow-y-auto bg-background">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}