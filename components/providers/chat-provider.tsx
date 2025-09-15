"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import FloatingChatButton from '@/components/chat/floating-chat-button'
import { useToast } from '@/hooks/use-toast'

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  agentId?: string
}

interface Agent {
  id: string
  name: string
  display_name: string
  description: string
  personality: string
  capabilities: string[]
  accent_color: string
  avatar_url?: string
}

interface ChatContextValue {
  messages: Message[]
  addMessage: (message: Message) => void
  clearMessages: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

const AI_AGENTS: Agent[] = [
  {
    id: "roxy",
    name: "roxy",
    display_name: "Roxy",
    description: "Strategic Decision Architect & Executive Assistant",
    personality: "Efficiently rebellious, organized chaos master, proactively punk",
    capabilities: ["SPADE Framework", "Strategic Planning", "Schedule Management", "Risk Assessment"],
    accent_color: "#8B5CF6"
  },
  {
    id: "blaze",
    name: "blaze", 
    display_name: "Blaze",
    description: "Growth & Sales Strategist",
    personality: "Energetically rebellious, results-driven with punk rock passion",
    capabilities: ["Cost-Benefit Analysis", "Sales Funnels", "Market Strategy", "Growth Planning"],
    accent_color: "#F59E0B"
  },
  {
    id: "echo",
    name: "echo",
    display_name: "Echo", 
    description: "Marketing Maven & Content Creator",
    personality: "Creatively rebellious, high-converting with warm punk energy",
    capabilities: ["Content Creation", "Brand Strategy", "Social Media", "Campaign Planning"],
    accent_color: "#EC4899"
  },
  {
    id: "lumi",
    name: "lumi",
    display_name: "Lumi",
    description: "Guardian AI & Compliance Co-Pilot",
    personality: "Proactive compliance expert with ethical decision-making",
    capabilities: ["GDPR/CCPA Compliance", "Policy Generation", "Legal Guidance", "Risk Management"],
    accent_color: "#10B981"
  },
  {
    id: "vex",
    name: "vex",
    display_name: "Vex",
    description: "Technical Architect & Systems Optimizer",
    personality: "Systems rebel, automation architect, technical problem solver",
    capabilities: ["System Design", "Automation", "Technical Strategy", "Process Optimization"],
    accent_color: "#3B82F6"
  },
  {
    id: "lexi",
    name: "lexi",
    display_name: "Lexi",
    description: "Strategy Analyst & Data Queen",
    personality: "Data-driven insights insurgent, analytical powerhouse",
    capabilities: ["Data Analysis", "Market Research", "Performance Metrics", "Strategic Insights"],
    accent_color: "#6366F1"
  },
  {
    id: "nova",
    name: "nova",
    display_name: "Nova",
    description: "Productivity & Time Management Coach",
    personality: "Productivity revolutionary, time optimization expert",
    capabilities: ["Time Management", "Workflow Optimization", "Productivity Systems", "Focus Techniques"],
    accent_color: "#06B6D4"
  },
  {
    id: "glitch",
    name: "glitch",
    display_name: "Glitch",
    description: "Problem-Solving Architect",
    personality: "Root cause investigator, creative problem solver",
    capabilities: ["Five Whys Analysis", "Problem Solving", "Innovation", "Creative Solutions"],
    accent_color: "#EF4444"
  }
]

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Load cached messages on mount
  useEffect(() => {
    const cachedMessages = localStorage.getItem('solosuccess_chat_messages')
    if (cachedMessages) {
      try {
        const parsed = JSON.parse(cachedMessages)
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })))
      } catch (error) {
        console.error('Error loading cached messages:', error)
      }
    }
  }, [])

  // Cache messages when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('solosuccess_chat_messages', JSON.stringify(messages))
    }
  }, [messages])

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message])
  }

  const clearMessages = () => {
    setMessages([])
    localStorage.removeItem('solosuccess_chat_messages')
  }

  const handleSendMessage = async (messageContent: string, agentId: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date(),
      agentId: agentId
    }

    addMessage(userMessage)
    setIsLoading(true)

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: messageContent,
          agentId: agentId
        }),
      })

      if (response.ok) {
        const reader = response.body?.getReader()
        if (reader) {
          const decoder = new TextDecoder()
          let assistantContent = ""
          
          // Create assistant message
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant", 
            content: "",
            timestamp: new Date(),
            agentId: agentId
          }
          
          addMessage(assistantMessage)
          
          // Stream response
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            
            const chunk = decoder.decode(value)
            assistantContent += chunk
            
            // Update the assistant message in real-time
            setMessages(prev => prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: assistantContent }
                : msg
            ))
          }
        }
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
        agentId: agentId
      }
      addMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const contextValue: ChatContextValue = {
    messages,
    addMessage,
    clearMessages,
    isLoading,
    setIsLoading
  }

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
      <FloatingChatButton
        agents={AI_AGENTS}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}