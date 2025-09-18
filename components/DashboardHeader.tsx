'use client'

import React, { useState } from 'react'
import { Crown, Sparkles, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import GlobalSearch from './GlobalSearch'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  className?: string
  showSearch?: boolean
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  className = '',
  showSearch = true
}) => {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  
  // Mock notifications - you can replace with real data
  const notifications = [
    { id: 1, title: "Welcome to SoloSuccess AI!", message: "Your profile is ready to go.", time: "2 min ago", unread: true },
    { id: 2, title: "Template Updated", message: "Your brand template has been saved.", time: "1 hour ago", unread: false },
    { id: 3, title: "New Features Available", message: "Check out the enhanced briefcase features.", time: "2 hours ago", unread: false },
  ]
  
  const unreadCount = notifications.filter(n => n.unread).length
  
  const handleProfileSettings = () => {
    router.push('/dashboard/settings')
  }
  
  const handleYourBriefcase = () => {
    router.push('/dashboard/briefcase')
  }
  
  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      logError('Sign out error:', error)
    }
  }

  return (
    <div className={`bg-gradient-to-r from-purple-50 via-pink-50 to-teal-50 border-b border-purple-200 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left side - Title or Search */}
        <div className="flex items-center gap-6 flex-1">
          {/* Sidebar Toggle */}
          <SidebarTrigger className="text-purple-600 hover:text-pink-600" />
          
          {title ? (
            <div>
              <div className="flex items-center gap-3">
                <Crown className="text-purple-600" size={24} />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                <Sparkles className="text-teal-500 animate-pulse" size={20} />
              </div>
              {subtitle && (
                <p className="text-purple-700/80 font-medium mt-1">{subtitle}</p>
              )}
            </div>
          ) : null}
          
          {/* Search Bar */}
          {showSearch && (
            <div className="flex-1 max-w-md mx-auto">
              <GlobalSearch />
            </div>
          )}
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Popover open={showNotifications} onOpenChange={setShowNotifications}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-purple-100 text-purple-600 hover:text-pink-600 transition-colors rounded-full"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h4 className="font-semibold text-purple-900">Notifications</h4>
                <p className="text-sm text-purple-600">You have {unreadCount} unread notifications</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-b-0 hover:bg-purple-50 cursor-pointer ${
                        notification.unread ? 'bg-purple-25' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-purple-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-pink-500 rounded-full mt-1 ml-2 flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-4 border-t">
                  <Button variant="outline" className="w-full text-sm">
                    View All Notifications
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 hover:bg-purple-100 text-purple-700 hover:text-pink-600 transition-all duration-200 px-3 py-2 rounded-full"
              >
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-purple-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <span className="font-medium">
                  {(user as any)?.name || user?.email?.split('@')[0] || 'User'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-white/95 backdrop-blur-sm border-purple-200"
            >
              <DropdownMenuLabel className="font-bold text-purple-900">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-purple-50"
                onClick={handleProfileSettings}
              >
                <Crown className="mr-2 h-4 w-4 text-purple-600" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-purple-50"
                onClick={handleYourBriefcase}
              >
                <Sparkles className="mr-2 h-4 w-4 text-pink-600" />
                <span>Your Briefcase</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-red-50 text-red-600"
                onClick={handleSignOut}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader