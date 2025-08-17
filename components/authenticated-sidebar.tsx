"use client"

import React from "react"
import { AppSidebar } from "./app-sidebar"
import { useUser } from "@stackframe/stack"

interface AuthenticatedSidebarProps extends React.ComponentProps<typeof AppSidebar> {
  // Allow overriding user data if needed
  fallbackUserData?: {
    name: string
    email: string
    avatar: string
  }
}

export function AuthenticatedSidebar({ fallbackUserData, ...props }: AuthenticatedSidebarProps) {
  const user = useUser()
  
  // Create user data with dynamic fallbacks based on available information
  const userData = {
    name: user?.displayName || 
          (user?.primaryEmail ? user.primaryEmail.split('@')[0] : null) || 
          fallbackUserData?.name ||
          "User",
    email: user?.primaryEmail || 
           fallbackUserData?.email ||
           "No email available",
    avatar: user?.profileImageUrl || 
            fallbackUserData?.avatar ||
            "/default-user.svg",
  }

  return <AppSidebar userData={userData} {...props} />
}