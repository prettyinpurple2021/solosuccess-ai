'use client'

import React from 'react'
import { Crown, Sparkles, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
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
  const { user } = useAuth()

  return (
    <div className={`bg-gradient-to-r from-purple-50 via-pink-50 to-teal-50 border-b border-purple-200 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left side - Title or Search */}
        <div className="flex items-center gap-6 flex-1">
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
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-purple-100 text-purple-600 hover:text-pink-600 transition-colors rounded-full"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full text-xs flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            </span>
          </Button>

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
              <DropdownMenuItem className="cursor-pointer hover:bg-purple-50">
                <Crown className="mr-2 h-4 w-4 text-purple-600" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-purple-50">
                <Sparkles className="mr-2 h-4 w-4 text-pink-600" />
                <span>Your Briefcase</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-red-50 text-red-600">
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