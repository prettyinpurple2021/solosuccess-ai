"use client"


export const dynamic = 'force-dynamic'
import React from 'react'
import { WorkflowDashboard } from '@/components/workflow/workflow-dashboard'

export default function WorkflowsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-purple-900/20">
      <WorkflowDashboard />
    </div>
  )
}
