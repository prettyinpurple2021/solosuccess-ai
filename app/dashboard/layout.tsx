"use client"

import type { ReactNode } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import DashboardHeader from "@/components/DashboardHeader"
import MobileNavigation from "@/components/mobile/mobile-navigation"
import { useAuth } from "@/hooks/use-auth"

export const dynamic = 'force-dynamic'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const { user } = useAuth()

  // Transform user data for MobileNavigation
  const mobileNavUser = user ? {
    name: (user as any).name || (user as any).full_name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    avatar: user.avatar_url || '',
    level: (user as any).level || 1,
    points: (user as any).points || 0
  } : undefined

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen bg-military-midnight border-0">
        <DashboardHeader />
        <main className="flex-1 p-0 pb-20 lg:pb-0">
          {children}
        </main>
        <MobileNavigation user={mobileNavUser} />
      </SidebarInset>
    </SidebarProvider>
  )
}