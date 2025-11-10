"use client"

import type { ReactNode } from 'react'
import { AppSidebar} from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset} from "@/components/ui/sidebar"
import DashboardHeader from "@/components/DashboardHeader"

export const dynamic = 'force-dynamic'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen">
        <DashboardHeader />
        <main className="flex-1 p-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}