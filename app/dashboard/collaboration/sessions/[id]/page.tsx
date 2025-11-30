// @ts-nocheck
'use client'

import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Users, MessageSquare, Settings, Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Import collaboration components
import MessageInterface from '@/components/collaboration/MessageInterface'
import AgentInterface from '@/components/collaboration/AgentInterface'
import SessionControls from '@/components/collaboration/SessionControls'


interface SessionData {
  id: string
  name: string
  description: string
  status: string
  type: string
  participatingAgents: string[]
  createdAt: string
  updatedAt: string
  userId: number
}
export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('messages')

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const resolvedParams = await params
        const response = await fetch(`/api/collaboration/sessions/${resolvedParams.id}`)
        if (response.ok) {
          const data = await response.json()
          setSession(data.data?.session)
        } else if (response.status === 404) {
          router.push('/dashboard/collaboration')
        }
      } catch (error) {
        logError('Error fetching session:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [params, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Session Not Found</h3>
          <p className="text-muted-foreground mb-4">
            The collaboration session you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => router.push('/dashboard/collaboration')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Collaboration Hub
          </Button>
        </Card>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/collaboration')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{session.name}</h1>
            <p className="text-muted-foreground">{session.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(session.status)}>
            {session.status}
          </Badge>
          <Badge variant="outline">
            {session.type}
          </Badge>
          <Badge variant="secondary">
            <Users className="w-3 h-3 mr-1" />
            {session.participatingAgents.length} agents
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Messages and Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="agents" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Agents
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="messages">
              <MessageInterface sessionId={session.id} />
            </TabsContent>

            <TabsContent value="agents">
              <AgentInterface />
            </TabsContent>

            <TabsContent value="activity">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Session Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">Session started</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {session.participatingAgents.map((agentId, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div>
                        <p className="text-sm font-medium">Agent {agentId} joined</p>
                        <p className="text-xs text-muted-foreground">
                          Estimated join time
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {session.updatedAt !== session.createdAt && (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <div>
                        <p className="text-sm font-medium">Session updated</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Session Controls */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <SessionControls sessionId={session.id} />
            
            {/* Session Info */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Session Info
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(session.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="capitalize">{session.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="capitalize">{session.status}</span>
                </div>
              </div>
            </Card>

            {/* Participants */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Participants ({session.participatingAgents.length})
              </h4>
              <div className="space-y-2">
                {session.participatingAgents.map((agentId, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm font-medium">{agentId}</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                ))}
                
                {session.participatingAgents.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No agents currently participating
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}