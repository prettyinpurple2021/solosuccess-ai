"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useAiChat } from "@/hooks/use-ai-chat"
import {
  MessageCircle,
  Users,
  TrendingUp,
  Megaphone,
  HeadphonesIcon,
  PenTool,
  Calendar,
  BarChart3,
  Settings,
  Send,
  Bot,
  Loader2,
  Sparkles,
  FileText,
  Crown,
  Heart,
  Star,
} from "lucide-react"

export default function VirtualTeam() {
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [message, setMessage] = useState("")

  // AI chat hook for the selected member
  const { chatHistory, sendMessage, clearHistory, isLoading, error } = useAiChat({
    memberId: selectedMember?.name?.toLowerCase() || "",
    initialHistory: [],
  })

  const teamMembers = [
    {
      id: 1,
      name: "Roxy",
      role: "Executive Assistant",
      avatar: "/images/agents/roxy.png",
      status: "active",
      expertise: ["Schedule Management", "Workflow Optimization", "Delegation Planning", "Quarterly Reviews"],
      description: "I manage your schedule, streamline workflows, and provide proactive executive assistance.",
      icon: Calendar,
      color: "bg-blue-500",
      aiModel: "GPT-4o",
      specialization: "Efficient, organized, proactive executive support",
      personality: "💪 Boss-level organized",
      currentMood: "Ready to slay your schedule! 📅",
    },
    {
      id: 2,
      name: "Blaze",
      role: "Growth & Sales Strategist",
      avatar: "/images/agents/blaze.png",
      status: "active",
      expertise: ["Idea Validation", "Sales Funnels", "Pitch Decks", "Negotiation Strategy"],
      description: "I drive growth through strategic sales planning and business development.",
      icon: TrendingUp,
      color: "bg-red-500",
      aiModel: "GPT-4o",
      specialization: "Energetic, results-driven growth expert",
      personality: "🔥 Fire sales energy",
      currentMood: "Let's crush those numbers! 📈",
    },
    {
      id: 3,
      name: "Echo",
      role: "Marketing Maven",
      avatar: "/images/agents/echo.png",
      status: "active",
      expertise: ["Campaign Content", "Brand Strategy", "Viral Hooks", "Partnership Planning"],
      description: "I create high-converting marketing content and build authentic brand connections.",
      icon: Megaphone,
      color: "bg-pink-500",
      aiModel: "Claude-3.5",
      specialization: "Fun, collaborative, connection-focused marketing",
      personality: "✨ Creative content queen",
      currentMood: "Ready to make you go viral! 🚀",
    },
    {
      id: 4,
      name: "Lumi",
      role: "Legal & Docs Agent",
      avatar: "/images/agents/lumi.png",
      status: "active",
      expertise: ["Legal Requirements", "Document Generation", "Contract Templates", "Risk Assessment"],
      description: "I provide legal guidance and document generation with appropriate disclaimers.",
      icon: FileText,
      color: "bg-purple-500",
      aiModel: "Claude-3.5",
      specialization: "Knowledgeable, precise legal assistance",
      personality: "🛡️ Legal protection boss",
      currentMood: "Protecting your empire! ⚖️",
    },
    {
      id: 5,
      name: "Vex",
      role: "Technical Architect",
      avatar: "/images/agents/vex.png",
      status: "active",
      expertise: ["Technical Specs", "Technology Decisions", "System Architecture", "Security Planning"],
      description: "I design technical solutions and guide technology decisions for your projects.",
      icon: Settings,
      color: "bg-indigo-500",
      aiModel: "GPT-4o",
      specialization: "Analytical, detail-oriented technical expert",
      personality: "⚙️ Tech architecture genius",
      currentMood: "Building your tech empire! 💻",
    },
    {
      id: 6,
      name: "Lexi",
      role: "Strategy & Insight Analyst",
      avatar: "/images/agents/lexi.png",
      status: "active",
      expertise: ["Data Analysis", "Strategic Insights", "KPI Tracking", "Values Alignment"],
      description: "I analyze data patterns and provide strategic insights for informed decision-making.",
      icon: BarChart3,
      color: "bg-green-500",
      aiModel: "Claude-3.5",
      specialization: "Data-driven strategic analysis expert",
      personality: "📊 Data-driven strategist",
      currentMood: "Analyzing your success! 📈",
    },
    {
      id: 7,
      name: "Nova",
      role: "Product Designer",
      avatar: "/images/agents/nova.png",
      status: "active",
      expertise: ["UI/UX Design", "Wireframing", "User Experience", "Design Systems"],
      description: "I create user-centric designs and optimize user experiences across all touchpoints.",
      icon: PenTool,
      color: "bg-orange-500",
      aiModel: "GPT-4o",
      specialization: "Creative, visual, user-centric designer",
      personality: "🎨 Design visionary",
      currentMood: "Designing your dreams! ✨",
    },
    {
      id: 8,
      name: "Glitch",
      role: "QA & Debug Agent",
      avatar: "/images/agents/glitch.png",
      status: "active",
      expertise: ["UX Friction Detection", "System Debugging", "Launch Tracking", "Quality Assurance"],
      description: "I identify friction points and system flaws to ensure optimal user experiences.",
      icon: HeadphonesIcon,
      color: "bg-teal-500",
      aiModel: "GPT-4o",
      specialization: "Detail-oriented quality assurance specialist",
      personality: "🔍 Quality perfectionist",
      currentMood: "Perfecting your empire! 🎯",
    },
  ]

  const handleSendMessage = async () => {
    if (message.trim() && selectedMember) {
      await sendMessage(message)
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <AuthGuard>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-gradient-to-r from-purple-50 to-teal-50">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold">AI Squad</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-4 bg-gradient-to-br from-purple-50/30 via-white to-teal-50/30">
          {/* Header Section */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight boss-heading flex items-center gap-3">
              <Users className="h-10 w-10 text-purple-600" />
              Your AI Girl Gang
              <span className="text-2xl">👯‍♀️</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Your intelligent team of AI specialists, powered by GPT-4o and Claude-3.5
              <br />
              <span className="empowering-text font-semibold">
                Because every boss needs a squad that's got her back! 💪
              </span>
            </p>
          </div>

          {/* Team Overview Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="boss-card glitter-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold empowering-text">Squad Members</CardTitle>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-purple-600" />
                  <Crown className="h-3 w-3 text-pink-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold soloboss-text-gradient">{teamMembers.length}</div>
                <p className="text-sm text-muted-foreground font-medium">AI boss babes ready 👑</p>
              </CardContent>
            </Card>

            <Card className="boss-card glitter-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold empowering-text">Active Squad</CardTitle>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <Star className="h-3 w-3 text-teal-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold soloboss-text-gradient">
                  {teamMembers.filter((m) => m.status === "active").length}
                </div>
                <p className="text-sm text-muted-foreground font-medium">Ready to slay 🔥</p>
              </CardContent>
            </Card>

            <Card className="boss-card glitter-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold empowering-text">AI Models</CardTitle>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-pink-600" />
                  <Bot className="h-3 w-3 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold soloboss-text-gradient">2</div>
                <p className="text-sm text-muted-foreground font-medium">GPT-4o & Claude-3.5 ✨</p>
              </CardContent>
            </Card>

            <Card className="boss-card glitter-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold empowering-text">Squad Chats</CardTitle>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-purple-600" />
                  <Heart className="h-3 w-3 text-pink-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold soloboss-text-gradient">{chatHistory.length}</div>
                <p className="text-sm text-muted-foreground font-medium">Boss conversations 💬</p>
              </CardContent>
            </Card>
          </div>

          {/* Team Members Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teamMembers.map((member) => (
              <Card key={member.id} className="boss-card bounce-on-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={member.avatar || "/placeholder.svg"}
                          alt={member.name}
                          className="h-12 w-12 rounded-full object-cover border-3 border-purple-200 punk-shadow"
                        />
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-base boss-heading">{member.name}</CardTitle>
                        <CardDescription className="text-sm font-medium">{member.role}</CardDescription>
                      </div>
                    </div>
                    <Badge className="girlboss-badge text-xs">{member.aiModel}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">{member.description}</p>
                    <div className="text-sm">
                      <span className="font-semibold empowering-text">Vibe:</span> {member.personality}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold empowering-text">Current Mood:</span> {member.currentMood}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-bold empowering-text">Boss Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.expertise.slice(0, 2).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs font-medium border-purple-200">
                          {skill}
                        </Badge>
                      ))}
                      {member.expertise.length > 2 && (
                        <Badge variant="outline" className="text-xs font-medium border-purple-200">
                          +{member.expertise.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full punk-button text-white font-semibold"
                        size="sm"
                        onClick={() => setSelectedMember(member)}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Chat with {member.name}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col boss-card border-2 border-purple-200">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 boss-heading">
                          <img
                            src={member.avatar || "/placeholder.svg"}
                            alt={member.name}
                            className="h-8 w-8 rounded-full object-cover punk-shadow"
                          />
                          Chat with {member.name}
                          <Badge className="girlboss-badge ml-auto">{member.aiModel}</Badge>
                        </DialogTitle>
                        <DialogDescription className="font-medium">
                          {member.role} • {member.specialization}
                          <br />
                          <span className="empowering-text">{member.currentMood}</span>
                        </DialogDescription>
                      </DialogHeader>

                      <div className="flex-1 flex flex-col space-y-4">
                        {/* Chat History */}
                        <ScrollArea className="flex-1 border rounded-lg p-3 boss-card">
                          <div className="space-y-3">
                            {chatHistory.length === 0 ? (
                              <div className="flex items-center justify-center h-32 text-muted-foreground">
                                <div className="text-center">
                                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-100 to-teal-100 flex items-center justify-center">
                                    <Bot className="h-8 w-8 text-purple-600" />
                                  </div>
                                  <p className="font-semibold empowering-text">
                                    Hey boss! I'm {member.name}. Ready to slay together? 💪
                                  </p>
                                  <p className="text-xs mt-1">Ask me about {member.expertise[0].toLowerCase()}</p>
                                </div>
                              </div>
                            ) : (
                              chatHistory.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                  <div
                                    className={`max-w-[80%] rounded-lg p-3 text-sm ${
                                      msg.sender === "user"
                                        ? "punk-button text-white"
                                        : "boss-card border border-purple-200"
                                    }`}
                                  >
                                    {msg.sender === "ai" && (
                                      <div className="flex items-center gap-2 mb-1">
                                        <img
                                          src={member.avatar || "/placeholder.svg"}
                                          alt={member.name}
                                          className="w-4 h-4 rounded-full object-cover"
                                        />
                                        <span className="text-xs font-bold empowering-text">{member.name}</span>
                                      </div>
                                    )}
                                    <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                                    <p className="text-xs opacity-70 mt-1 font-medium">{msg.timestamp}</p>
                                  </div>
                                </div>
                              ))
                            )}
                            {isLoading && (
                              <div className="flex justify-start">
                                <div className="boss-card border border-purple-200 rounded-lg p-3 text-sm max-w-[80%]">
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-teal-500"></div>
                                    <span className="text-xs font-bold empowering-text">{member.name}</span>
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  </div>
                                  <p className="text-muted-foreground font-medium">Thinking like a boss...</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </ScrollArea>

                        {/* Message Input */}
                        <div className="flex gap-2">
                          <Input
                            placeholder={`Ask ${member.name} about ${member.expertise[0].toLowerCase()}...`}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                            className="border-2 border-purple-200 focus:border-purple-400 font-medium"
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={isLoading || !message.trim()}
                            className="punk-button text-white"
                          >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      {error && (
                        <div className="text-sm text-red-500 bg-red-50 p-2 rounded font-medium">
                          Error: {error.message}
                        </div>
                      )}

                      <div className="flex justify-between text-xs text-muted-foreground font-medium">
                        <span>Powered by {member.aiModel} ✨</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearHistory}
                          className="h-auto p-0 text-xs hover:text-purple-600"
                        >
                          Clear chat
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Motivational Footer */}
          <Card className="boss-card soloboss-gradient text-white">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Crown className="h-6 w-6" />
                Your business. Your terms. Your AI squad.
                <Crown className="h-6 w-6" />
              </h3>
              <p className="text-lg opacity-90">
                Every boss needs a team that's got her back. Your AI girl gang is here 24/7! 💪✨
              </p>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </AuthGuard>
  )
}
