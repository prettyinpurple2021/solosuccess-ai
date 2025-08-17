"use client"

import { useState } from "react"

interface Project {
  id: string
  name: string
  description?: string
  color: string
  icon: string
  status: "active" | "archived" | "completed"
  created_at: string
  updated_at: string
}

interface UseProjectsResult {
  projects: Project[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  lastUpdated: Date | null
}

export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // For now, return empty projects since Stack Auth might not be available
  // In a real implementation, this could check for authentication in other ways
  return {
    projects,
    loading,
    error,
    refetch: async () => {},
    lastUpdated: null,
  }
}