'use client'

import React, { useState } from 'react'
import AvatarUpload from '@/components/AvatarUpload'
import UnifiedBriefcase from '@/components/UnifiedBriefcase'
import { useAvatar } from '@/hooks/useAvatar'
import { briefcaseAutoSaver } from '@/utils/briefcase-auto-save'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, MessageCircle, Palette, Crown, Heart, Sparkles, Zap } from 'lucide-react'

const BriefcaseDemo = () => {
  const { avatar, loading: avatarLoading, updateAvatar } = useAvatar()
  const [demoData, setDemoData] = useState({
    chatTitle: 'Demo Chat with AI Agent',
    templateTitle: 'Business Plan Template',
    brandTitle: 'My Brand Identity'
  })

  const handleSaveDemoChat = async () => {
    const demoMessages = [
      { role: 'user', content: 'Hello, I need help with my business plan.' },
      { role: 'assistant', content: 'I\'d be happy to help you with your business plan! Let\'s start by understanding your business concept.' },
      { role: 'user', content: 'I\'m planning to start a sustainable tech consulting company.' },
      { role: 'assistant', content: 'That\'s a great concept! Sustainable tech is growing rapidly. Let me help you structure your business plan.' }
    ]

    await briefcaseAutoSaver.saveChatConversation(
      'demo-chat-123',
      demoData.chatTitle,
      demoMessages,
      'Business Advisor'
    )

    alert('Demo chat saved to briefcase!')
  }

  const handleSaveDemoTemplate = async () => {
    const demoContent = {
      executiveSummary: 'A sustainable tech consulting company focusing on green solutions.',
      targetMarket: 'Small to medium businesses looking to reduce their environmental impact.',
      revenue: '$500K projected first year',
      progress: 75
    }

    await briefcaseAutoSaver.saveTemplateProgress(
      'business-plan-template',
      demoData.templateTitle,
      demoContent,
      75
    )

    alert('Demo template progress saved to briefcase!')
  }

  const handleSaveDemoBrand = async () => {
    const demoBrandData = {
      name: 'EcoTech Solutions',
      colors: {
        primary: '#22c55e',
        secondary: '#16a34a',
        accent: '#059669'
      },
      fonts: {
        primary: 'Inter',
        secondary: 'Roboto'
      },
      logo: 'Modern leaf with circuit pattern',
      tagline: 'Technology for a Greener Tomorrow',
      values: ['Sustainability', 'Innovation', 'Excellence']
    }

    await briefcaseAutoSaver.saveBrandWork(demoData.brandTitle, demoBrandData)
    alert('Demo brand work saved to briefcase!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Crown className="text-purple-600" size={48} />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600 bg-clip-text text-transparent">
              Unified Briefcase System Demo
            </h1>
            <Sparkles className="text-teal-600 animate-pulse" size={48} />
          </div>
          <p className="text-xl text-purple-700/80 font-medium flex items-center justify-center gap-3">
            <Heart size={20} className="text-pink-500" />
            Your personal workspace for all content, conversations, and files
            <Heart size={20} className="text-pink-500" />
          </p>
        </div>

        <Tabs defaultValue="briefcase" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border-purple-200 rounded-2xl p-2">
            <TabsTrigger value="briefcase" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white font-bold flex items-center gap-2">
              <Crown size={16} />
              Your Briefcase
            </TabsTrigger>
            <TabsTrigger value="avatar" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-bold flex items-center gap-2">
              <Sparkles size={16} />
              Avatar Upload
            </TabsTrigger>
            <TabsTrigger value="demo" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-bold flex items-center gap-2">
              <Zap size={16} />
              Save Demo Content
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="briefcase" className="space-y-4">
            <UnifiedBriefcase />
          </TabsContent>
          
          <TabsContent value="avatar" className="space-y-4">
            <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-lg shadow-purple-100/50 p-8">
              <div className="text-center mb-6">
                <Crown className="text-purple-600 mx-auto mb-3" size={32} />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Upload Your Avatar
                </h2>
                <Sparkles className="text-teal-500 mx-auto mt-2 animate-pulse" size={20} />
              </div>
              <AvatarUpload 
                currentAvatar={avatar}
                onAvatarChange={updateAvatar}
                className="flex flex-col items-center"
              />
              {avatarLoading && (
                <div className="mt-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-4 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
                  <p className="text-sm text-purple-600 mt-2 font-medium flex items-center justify-center gap-2">
                    <Heart size={12} className="animate-bounce text-pink-500" />
                    Loading avatar...
                    <Heart size={12} className="animate-bounce text-pink-500" />
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="demo" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Demo Chat Save */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-purple-200 p-6 hover:shadow-lg hover:shadow-purple-200/50 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-teal-100 to-purple-100 rounded-xl border border-teal-300 group-hover:scale-110 transition-transform duration-200">
                    <MessageCircle className="text-teal-700" size={20} />
                  </div>
                  <h3 className="font-bold text-purple-900 flex items-center gap-2">
                    Save Demo Chat
                    <Sparkles size={16} className="text-teal-500" />
                  </h3>
                </div>
                <input
                  type="text"
                  value={demoData.chatTitle}
                  onChange={(e) => setDemoData({ ...demoData, chatTitle: e.target.value })}
                  className="w-full p-3 border border-purple-200 rounded-full mb-4 text-sm bg-gradient-to-r from-purple-50 to-pink-50 font-medium text-purple-700 focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
                  placeholder="✨ Chat title, queen..."
                />
                <p className="text-sm text-purple-700/80 mb-4 font-medium">
                  This will save a demo conversation with an AI business advisor to your briefcase.
                </p>
                <button
                  onClick={handleSaveDemoChat}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white rounded-full transition-all duration-300 hover:scale-105 shadow-lg font-bold group"
                >
                  <Save size={16} className="group-hover:animate-bounce" />
                  Save Demo Chat
                  <Heart size={14} className="opacity-70" />
                </button>
              </div>

              {/* Demo Template Save */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-purple-200 p-6 hover:shadow-lg hover:shadow-purple-200/50 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-teal-100 rounded-xl border border-purple-300 group-hover:scale-110 transition-transform duration-200">
                    <Save className="text-purple-700" size={20} />
                  </div>
                  <h3 className="font-bold text-purple-900 flex items-center gap-2">
                    Save Template Progress
                    <Crown size={16} className="text-purple-500" />
                  </h3>
                </div>
                <input
                  type="text"
                  value={demoData.templateTitle}
                  onChange={(e) => setDemoData({ ...demoData, templateTitle: e.target.value })}
                  className="w-full p-3 border border-purple-200 rounded-full mb-4 text-sm bg-gradient-to-r from-purple-50 to-pink-50 font-medium text-purple-700 focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                  placeholder="✨ Template title, babe..."
                />
                <p className="text-sm text-purple-700/80 mb-4 font-medium">
                  This will save demo progress (75%) on a business plan template to your briefcase.
                </p>
                <button
                  onClick={handleSaveDemoTemplate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white rounded-full transition-all duration-300 hover:scale-105 shadow-lg font-bold group"
                >
                  <Save size={16} className="group-hover:animate-bounce" />
                  Save Template Progress
                  <Sparkles size={14} className="opacity-70" />
                </button>
              </div>

              {/* Demo Brand Save */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-purple-200 p-6 hover:shadow-lg hover:shadow-purple-200/50 transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl border border-pink-300 group-hover:scale-110 transition-transform duration-200">
                    <Palette className="text-pink-700" size={20} />
                  </div>
                  <h3 className="font-bold text-purple-900 flex items-center gap-2">
                    Save Brand Work
                    <Heart size={16} className="text-pink-500" />
                  </h3>
                </div>
                <input
                  type="text"
                  value={demoData.brandTitle}
                  onChange={(e) => setDemoData({ ...demoData, brandTitle: e.target.value })}
                  className="w-full p-3 border border-purple-200 rounded-full mb-4 text-sm bg-gradient-to-r from-pink-50 to-purple-50 font-medium text-purple-700 focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
                  placeholder="✨ Brand work title, queen..."
                />
                <p className="text-sm text-purple-700/80 mb-4 font-medium">
                  This will save demo brand identity work including colors, fonts, and values to your briefcase.
                </p>
                <button
                  onClick={handleSaveDemoBrand}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full transition-all duration-300 hover:scale-105 shadow-lg font-bold group"
                >
                  <Palette size={16} className="group-hover:animate-bounce" />
                  Save Brand Work
                  <Crown size={14} className="opacity-70" />
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-teal-50 border border-purple-200 rounded-2xl p-6 shadow-lg shadow-purple-100/50">
              <div className="text-center mb-4">
                <Crown className="text-purple-600 mx-auto mb-2" size={28} />
                <h4 className="font-bold text-purple-900 text-lg flex items-center justify-center gap-2">
                  How it works, queen!
                  <Sparkles size={16} className="text-teal-500" />
                </h4>
              </div>
              <ul className="text-sm text-purple-800 space-y-2 font-medium">
                <li className="flex items-center gap-2">
                  <Heart size={12} className="text-pink-500" />
                  <strong>Chat Conversations:</strong> Auto-saved after 3+ messages with smart titles
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles size={12} className="text-teal-500" />
                  <strong>Template Progress:</strong> Saves your work-in-progress with completion percentage
                </li>
                <li className="flex items-center gap-2">
                  <Crown size={12} className="text-purple-500" />
                  <strong>Brand Work:</strong> Stores your brand identity elements and assets
                </li>
                <li className="flex items-center gap-2">
                  <Zap size={12} className="text-pink-500" />
                  <strong>Avatar Upload:</strong> Manages profile pictures with blob storage
                </li>
                <li className="flex items-center gap-2">
                  <Heart size={12} className="text-teal-500" />
                  <strong>Search & Filter:</strong> Find your content by type, tags, or search terms
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default BriefcaseDemo