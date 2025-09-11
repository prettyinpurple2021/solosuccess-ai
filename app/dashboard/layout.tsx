"use client"

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Briefcase, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export const dynamic = 'force-dynamic'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Simple sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"></div>
            <span className="font-bold text-lg">SoloSuccess AI</span>
          </div>
          
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <span>Dashboard</span>
            </Link>
            <Link href="/dashboard/slaylist" className="flex items-center gap-2 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <span>SlayList</span>
            </Link>
            <Link href="/dashboard/agents" className="flex items-center gap-2 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <span>AI Squad</span>
            </Link>
            <Link href="/dashboard/brand" className="flex items-center gap-2 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <span>Brand Studio</span>
            </Link>
            <Link href="/dashboard/focus" className="flex items-center gap-2 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <span>Focus Mode</span>
            </Link>
            <Link href="/dashboard/burnout" className="flex items-center gap-2 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <span>Burnout Shield</span>
            </Link>
            {/* Briefcase */}
            <Link href="/dashboard/briefcase" className="flex items-center gap-2 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Briefcase className="h-4 w-4" />
              <span>Briefcase</span>
            </Link>
            {/* Settings */}
            <Link href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
            {/* Logout */}
            <button onClick={() => signOut()} className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-700 rounded-lg hover:bg-gray-100">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}