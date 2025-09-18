'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, Crown, Heart, Sparkles, MessageCircle, Palette, FileText, Star, User, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'

interface SearchResult {
  id: string
  type: 'chat' | 'brand' | 'template_save' | 'avatar' | 'document' | 'ai_interaction'
  title: string
  description?: string
  url: string
  metadata?: any
}

const SEARCH_PLACEHOLDERS = [
  "Search your empire, queen... ✨",
  "Find your content, babe... 👑",
  "What are you looking for? 💎",
  "Search like the boss you are... 💅"
]

const TYPE_ICONS = {
  chat: MessageCircle,
  brand: Palette,
  template_save: Star,
  avatar: Crown,
  document: FileText,
  ai_interaction: Sparkles
}

const TYPE_COLORS = {
  chat: 'text-teal-600',
  brand: 'text-pink-600',
  template_save: 'text-purple-600',
  avatar: 'text-purple-600',
  document: 'text-gray-600',
  ai_interaction: 'text-teal-600'
}

export const GlobalSearch: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [query, setQuery] = useState('')
  const [placeholder, setPlaceholder] = useState(SEARCH_PLACEHOLDERS[0])
  const router = useRouter()

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(prev => {
        const currentIndex = SEARCH_PLACEHOLDERS.indexOf(prev)
        const nextIndex = (currentIndex + 1) % SEARCH_PLACEHOLDERS.length
        return SEARCH_PLACEHOLDERS[nextIndex]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Search function
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/unified-briefcase?search=${encodeURIComponent(searchQuery)}&limit=10`)
      
      if (response.ok) {
        const data = await response.json()
        const searchResults: SearchResult[] = data.items?.map((item: any) => ({
          id: item.id,
          type: item.type,
          title: item.title,
          description: item.description,
          url: getItemUrl(item),
          metadata: item.metadata
        })) || []

        setResults(searchResults)
      }
    } catch (error) {
      logError('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getItemUrl = (item: any) => {
    switch (item.type) {
      case 'chat':
        return `/dashboard/agents?chat=${item.id}`
      case 'brand':
        return `/dashboard/brand?item=${item.id}`
      case 'template_save':
        return `/templates/${item.metadata?.templateSlug || 'unknown'}?save=${item.id}`
      case 'avatar':
        return `/dashboard/settings#avatar`
      case 'document':
        return `/dashboard/briefcase?item=${item.id}`
      default:
        return `/dashboard/briefcase?item=${item.id}`
    }
  }

  const handleSelect = (url: string) => {
    setOpen(false)
    router.push(url)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => performSearch(query), 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 w-full max-w-sm px-4 py-2.5 bg-gradient-to-r from-purple-50 via-pink-50 to-teal-50 border border-purple-200 rounded-full hover:border-pink-300 hover:shadow-md hover:shadow-purple-200/50 transition-all duration-300 group"
      >
        <Search className="text-purple-400 group-hover:text-pink-500 transition-colors" size={16} />
        <span className="text-purple-600/70 text-sm font-medium flex-1 text-left">
          {placeholder}
        </span>
        <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-full text-xs font-bold text-purple-600">
          <span>⌘</span>
          <span>K</span>
        </div>
      </button>

      {/* Search Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
          <div className="flex items-center gap-3 p-4 border-b border-purple-200">
            <Crown className="text-purple-600" size={20} />
            <h2 className="font-bold text-purple-900 flex items-center gap-2">
              Search Your Empire
              <Sparkles size={16} className="text-teal-500" />
            </h2>
          </div>
          
          <Command className="rounded-lg border-0 shadow-none bg-transparent">
            <CommandInput
              placeholder="Search your briefcase, conversations, brand work..."
              value={query}
              onValueChange={setQuery}
              className="border-0 focus:ring-0 text-purple-900 placeholder-purple-500/70"
            />
            
            <CommandList className="max-h-96 p-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-transparent bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <span className="ml-3 text-purple-600 font-medium">Searching your content...</span>
                </div>
              ) : (
                <>
                  <CommandEmpty className="py-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Crown size={32} className="text-purple-400" />
                      <div>
                        <p className="font-bold text-purple-900 mb-1">No results found, queen!</p>
                        <p className="text-sm text-purple-600/80">Try searching for chats, brand work, or templates</p>
                      </div>
                    </div>
                  </CommandEmpty>

                  {results.length > 0 && (
                    <CommandGroup heading={
                      <div className="flex items-center gap-2 text-purple-700 font-bold">
                        <Heart size={14} className="text-pink-500" />
                        Your Content
                      </div>
                    }>
                      {results.map((result) => {
                        const IconComponent = TYPE_ICONS[result.type]
                        const colorClass = TYPE_COLORS[result.type]
                        
                        return (
                          <CommandItem
                            key={result.id}
                            onSelect={() => handleSelect(result.url)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/80 cursor-pointer transition-all duration-200 hover:scale-102"
                          >
                            <div className={`p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 ${colorClass}`}>
                              <IconComponent size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-purple-900 truncate">{result.title}</p>
                              {result.description && (
                                <p className="text-xs text-purple-600/80 truncate">{result.description}</p>
                              )}
                            </div>
                            <Sparkles size={12} className="text-teal-500" />
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  )}

                  {query.length === 0 && (
                    <>
                      <CommandGroup heading={
                        <div className="flex items-center gap-2 text-purple-700 font-bold">
                          <Zap size={14} className="text-teal-500" />
                          Quick Actions
                        </div>
                      }>
                        <CommandItem onSelect={() => handleSelect('/dashboard/agents')}>
                          <MessageCircle className="mr-3 h-4 w-4 text-teal-600" />
                          <span className="font-medium">Chat with AI Agents</span>
                        </CommandItem>
                        <CommandItem onSelect={() => handleSelect('/dashboard/brand')}>
                          <Palette className="mr-3 h-4 w-4 text-pink-600" />
                          <span className="font-medium">Brand Studio</span>
                        </CommandItem>
                        <CommandItem onSelect={() => handleSelect('/templates')}>
                          <Star className="mr-3 h-4 w-4 text-purple-600" />
                          <span className="font-medium">Browse Templates</span>
                        </CommandItem>
                        <CommandItem onSelect={() => handleSelect('/dashboard/briefcase')}>
                          <FileText className="mr-3 h-4 w-4 text-gray-600" />
                          <span className="font-medium">Your Briefcase</span>
                        </CommandItem>
                      </CommandGroup>
                    </>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </div>
      </CommandDialog>
    </>
  )
}

export default GlobalSearch