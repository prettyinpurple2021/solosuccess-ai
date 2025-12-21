// @ts-nocheck
'use client'

import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
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
    <div className={`bg-cyber-black/80 backdrop-blur-md border-b border-cyber-cyan/20 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left side - Title or Search */}
        <div className="flex items-center gap-6 flex-1">
          {/* Sidebar Toggle */}
          <SidebarTrigger className="text-white hover:text-cyber-cyan" />
          
          {title ? (
            <div>
              <div className="flex items-center gap-3">
                <Crown className="text-neon-magenta" size={24} />
                <h1 className="text-2xl font-sci font-bold bg-gradient-to-r from-cyber-cyan via-white to-cyber-purple bg-clip-text text-transparent">
                  {title}
                </h1>
                <Sparkles className="text-cyber-purple animate-pulse" size={20} />
              </div>
              {subtitle && (
                <p className="text-gray-400 font-tech mt-1">{subtitle}</p>
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
                className="relative hover:bg-cyber-dark text-white hover:text-cyber-cyan transition-colors rounded-full"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-purple rounded-full text-xs flex items-center justify-center text-white font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h4 className="font-sci font-semibold text-white">Notifications</h4>
                <p className="text-sm text-gray-400 font-tech">You have {unreadCount} unread notifications</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                    <p className="font-tech">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-cyber-cyan/10 last:border-b-0 hover:bg-cyber-dark/40 cursor-pointer ${
                        notification.unread ? 'bg-cyber-purple/10' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-sci font-medium text-sm text-white">{notification.title}</p>
                          <p className="text-sm text-gray-400 font-tech mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 font-tech mt-2">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-cyber-purple rounded-full mt-1 ml-2 flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-4 border-t">
                  <Button variant="outline" className="w-full text-sm border-cyber-cyan/30 text-white hover:bg-cyber-dark font-tech">
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
                className="flex items-center gap-3 hover:bg-cyber-dark text-white hover:text-cyber-cyan transition-all duration-200 px-3 py-2 rounded-full"
              >
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-cyber-cyan/40"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-white font-bold text-sm">
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
              className="w-56 bg-cyber-black/95 backdrop-blur-sm border-cyber-cyan/30"
            >
              <DropdownMenuLabel className="font-sci font-bold text-white">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-cyber-dark text-white"
                onClick={handleProfileSettings}
              >
                <Crown className="mr-2 h-4 w-4 text-cyber-cyan" />
                <span className="font-tech">Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-cyber-dark text-white"
                onClick={handleYourBriefcase}
              >
                <Sparkles className="mr-2 h-4 w-4 text-cyber-purple" />
                <span className="font-tech">Your Briefcase</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-red-900/20 text-red-400 font-tech"
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