"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Crown, Sparkles, MessageCircle, Users } from "lucide-react"
import { aiAgents } from "@/lib/landing-data"
import { useAiChat } from "@/hooks/use-ai-chat"

export default function AgentsPage() {
  const searchParams = useSearchParams()
  const conversationId = searchParams.get("conversation")
  
  const [selectedAgent, setSelectedAgent] = useState(aiAgents[0])
  const [message, setMessage] = useState("")
  const [conversationData, setConversationData] = useState<any>(null)
  const [loadingConversation, setLoadingConversation] = useState(false)

  const {
    messages,
    isLoading,
    append,
    setMessages,
  } = useAiChat({ agentId: selectedAgent.id })

  // Load conversation if conversationId is provided
  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId)
    }
  }, [conversationId])

  const loadConversation = async (id: string) => {
    setLoadingConversation(true)
    try {
      const response = await fetch(`/api/conversations/${id}`)
      if (response.ok) {
        const data = await response.json()
        setConversationData(data)
        
        // Find the agent based on the conversation's agent_id
        const agent = aiAgents.find(a => a.id === data.agent_id) || aiAgents[0]
        setSelectedAgent(agent)
        
        // Set the conversation messages
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages)
        }
      } else {
        console.error("Failed to load conversation")
      }
    } catch (error) {
      console.error("Error loading conversation:", error)
    } finally {
      setLoadingConversation(false)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return
    await append({ role: "user", content: message })
    setMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (loadingConversation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading conversation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Crown className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold gradient-text-primary">AI Agents</h1>
                <p className="text-sm text-muted-foreground">
                  {conversationId ? "Continue your conversation" : "Chat with your AI team"}
                </p>
              </div>
            </div>
            <Badge className="bg-gradient-primary text-white border-0">
              <Users className="w-4 h-4 mr-2" />8 Agents Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Agent Selection Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" />
                  Your AI Squad
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2 p-4">
                    {aiAgents.map((agent) => (
                      <Button
                        key={agent.id}
                        variant={selectedAgent.id === agent.id ? "default" : "ghost"}
                        className={`w-full justify-start p-4 h-auto ${
                          selectedAgent.id === agent.id ? "bg-gradient-primary text-white" : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedAgent(agent)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${agent.color} p-0.5`}>
                            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                              <Image
                                src={agent.avatar || "/default-user.svg"}
                                alt={agent.name}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-xs opacity-80">{agent.role}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[700px] flex flex-col">
              {/* Agent Header */}
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${selectedAgent.color} p-0.5`}>
                      <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                        <Image
                          src={selectedAgent.avatar || "/default-user.svg"}
                          alt={selectedAgent.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{selectedAgent.name}</h2>
                      <p className="text-sm text-primary font-medium">{selectedAgent.role}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedAgent.specialty}
                      </p>
                    </div>
                  </div>
                  {conversationData && (
                    <Badge variant="secondary">
                      Conversation #{conversationData.id.slice(-8)}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              {/* Chat Messages */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${selectedAgent.color} p-1 mb-4`}>
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                          <Image
                            src={selectedAgent.avatar || "/default-user.svg"}
                            alt={selectedAgent.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Chat with {selectedAgent.name}</h3>
                      <p className="text-muted-foreground max-w-md">
                        {conversationId ? "Continue your conversation below." : `Start a conversation with your ${selectedAgent.role.toLowerCase()}.`}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.role === "user" ? "bg-gradient-primary text-white" : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>

                <div className="border-t border-border p-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder={`Message ${selectedAgent.name}...`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !message.trim()}
                      size="sm"
                      className="gradient-primary text-white hover:opacity-90"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <MessageCircle className="w-3 h-3" />
                      <span>{messages.length} messages</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}