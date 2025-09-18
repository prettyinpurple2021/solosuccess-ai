// @ts-nocheck
'use client'

import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import React, { useState, useEffect } from 'react'

import {
  MessageCircle, 
  Palette, 
  FileText, 
  User, 
  Calendar,
  Eye,
  Trash2,
  Download,
  Search,
  Filter,
  Grid,
  List,
  Clock,
  Crown,
  Heart,
  Sparkles,
  Skull,
  Star,
  Zap
} from 'lucide-react'

interface BriefcaseItem {
  id: string
  briefcaseId: string
  userId: string
  type: 'avatar' | 'chat' | 'brand' | 'template_save' | 'document' | 'ai_interaction'
  title: string
  description?: string
  content?: Record<string, any>
  blobUrl?: string
  fileSize?: number
  mimeType?: string
  tags: string[]
  metadata: Record<string, any>
  isPrivate: boolean
  createdAt: string
  updatedAt: string
}

interface UnifiedBriefcaseProps {
  className?: string
}

const ITEM_TYPE_ICONS = {
  avatar: Crown,
  chat: MessageCircle,
  brand: Heart,
  template_save: Star,
  document: FileText,
  ai_interaction: Sparkles
}

const ITEM_TYPE_LABELS = {
  avatar: 'Avatar',
  chat: 'Chat Conversation',
  brand: 'Brand Work',
  template_save: 'Template Save',
  document: 'Document',
  ai_interaction: 'AI Interaction'
}

const ITEM_TYPE_COLORS = {
  avatar: 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 text-purple-700',
  chat: 'bg-gradient-to-br from-teal-100 to-purple-100 border-teal-300 text-teal-700',
  brand: 'bg-gradient-to-br from-pink-100 to-purple-100 border-pink-300 text-pink-700',
  template_save: 'bg-gradient-to-br from-purple-100 to-teal-100 border-purple-300 text-purple-700',
  document: 'bg-gradient-to-br from-gray-100 to-purple-100 border-gray-300 text-gray-700',
  ai_interaction: 'bg-gradient-to-br from-teal-100 to-pink-100 border-teal-300 text-teal-700'
}

const UnifiedBriefcase: React.FC<UnifiedBriefcaseProps> = ({ className = '' }) => {
  const [items, setItems] = useState<BriefcaseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [pagination, setPagination] = useState({
    total: 0,
    hasMore: false,
    offset: 0,
    limit: 20
  })

  const loadItems = async (offset = 0, type?: string) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: offset.toString()
      })

      if (type && type !== 'all') {
        params.set('type', type)
      }

      const response = await fetch(`/api/unified-briefcase?${params}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load items')
      }

      if (offset === 0) {
        setItems(result.items)
      } else {
        setItems(prev => [...prev, ...result.items])
      }

      setPagination({
        total: result.total,
        hasMore: result.hasMore,
        offset: offset,
        limit: pagination.limit
      })

    } catch (error) {
      logError('Load briefcase items error:', error)
      setError(error instanceof Error ? error.message : 'Failed to load items')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/unified-briefcase?id=${itemId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to delete item')
      }

      // Remove item from local state
      setItems(prev => prev.filter(item => item.id !== itemId))

    } catch (error) {
      logError('Delete item error:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete item')
    }
  }

  const handleLoadMore = () => {
    const nextOffset = pagination.offset + pagination.limit
    loadItems(nextOffset, selectedType !== 'all' ? selectedType : undefined)
  }

  const handleTypeFilter = (type: string) => {
    setSelectedType(type)
    setPagination(prev => ({ ...prev, offset: 0 }))
    loadItems(0, type !== 'all' ? type : undefined)
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSearch
  })

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size'
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${Math.round(size * 10) / 10} ${units[unitIndex]}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    loadItems()
  }, [])

  const ItemCard: React.FC<{ item: BriefcaseItem }> = ({ item }) => {
    const IconComponent = ITEM_TYPE_ICONS[item.type]
    const colorClass = ITEM_TYPE_COLORS[item.type]

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-purple-200 p-5 hover:border-pink-300 hover:shadow-lg hover:shadow-purple-200/50 transition-all duration-300 hover:scale-102 group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border-2 ${colorClass} group-hover:scale-110 transition-transform duration-200`}>
              <IconComponent size={20} />
            </div>
            <div>
              <h3 className="font-bold text-purple-900 truncate mb-1">{item.title}</h3>
              <p className="text-xs text-purple-600/80 font-medium flex items-center gap-1">
                <Sparkles size={10} />
                {ITEM_TYPE_LABELS[item.type]}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDeleteItem(item.id)}
              className="p-2 text-purple-400 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-all duration-200 hover:scale-110"
              title="Delete item"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {item.description && (
          <p className="text-sm text-purple-700/80 mb-4 line-clamp-2 font-medium">
            {item.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-full font-medium border border-purple-200 hover:scale-105 transition-transform duration-200"
            >
              ✨ {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-purple-600/70">
          <div className="flex items-center gap-1 font-medium">
            <Clock size={12} className="text-teal-500" />
            <span>{formatDate(item.updatedAt)}</span>
          </div>
          
          {item.fileSize && (
            <span className="flex items-center gap-1">
              <Heart size={10} className="text-pink-500" />
              {formatFileSize(item.fileSize)}
            </span>
          )}
        </div>
      </div>
    )
  }

  const ItemRow: React.FC<{ item: BriefcaseItem }> = ({ item }) => {
    const IconComponent = ITEM_TYPE_ICONS[item.type]
    const colorClass = ITEM_TYPE_COLORS[item.type]

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-purple-200 p-5 hover:border-pink-300 hover:shadow-lg hover:shadow-purple-200/50 transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className={`p-3 rounded-xl border-2 ${colorClass} group-hover:scale-110 transition-transform duration-200`}>
              <IconComponent size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-purple-900 truncate">{item.title}</h3>
              <p className="text-sm text-purple-600/80 truncate font-medium flex items-center gap-1">
                <Sparkles size={12} />
                {item.description || ITEM_TYPE_LABELS[item.type]}
              </p>
            </div>
            
            <div className="flex gap-2">
              {item.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-full font-medium border border-purple-200"
                >
                  ✨ {tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="px-3 py-1 bg-gradient-to-r from-teal-100 to-purple-100 text-teal-700 text-xs rounded-full font-medium border border-teal-200">
                  +{item.tags.length - 3} more
                </span>
              )}
            </div>
            
            <div className="text-sm text-purple-600/70 min-w-0 font-medium flex items-center gap-1">
              <Clock size={12} className="text-teal-500" />
              {formatDate(item.updatedAt)}
            </div>
            
            {item.fileSize && (
              <div className="text-sm text-purple-600/70 min-w-0 font-medium flex items-center gap-1">
                <Heart size={12} className="text-pink-500" />
                {formatFileSize(item.fileSize)}
              </div>
            )}
          </div>
          
          <button
            onClick={() => handleDeleteItem(item.id)}
            className="ml-4 p-3 text-purple-400 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-all duration-200 hover:scale-110"
            title="Delete item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50 min-h-screen ${className}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="text-purple-600" size={32} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600 bg-clip-text text-transparent">
              Your Briefcase
            </h1>
            <Sparkles className="text-teal-600 animate-pulse" size={32} />
          </div>
          <p className="text-purple-700/80 text-lg font-medium flex items-center justify-center gap-2">
            <Heart size={16} className="text-pink-500" />
            All your created content, conversations, and files in one place
            <Heart size={16} className="text-pink-500" />
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-lg shadow-purple-100/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
                <input
                  type="text"
                  placeholder="✨ Search your briefcase, queen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-purple-200 rounded-full focus:ring-2 focus:ring-pink-400 focus:border-pink-400 min-w-0 sm:min-w-[300px] bg-gradient-to-r from-purple-50 to-pink-50 placeholder-purple-400 font-medium"
                />
              </div>
              
              <select
                value={selectedType}
                onChange={(e) => handleTypeFilter(e.target.value)}
                className="px-4 py-3 border border-purple-200 rounded-full focus:ring-2 focus:ring-pink-400 focus:border-pink-400 bg-gradient-to-r from-purple-50 to-pink-50 font-medium text-purple-700"
              >
                <option value="all">All Types</option>
                <option value="chat">Chats</option>
                <option value="brand">Brand Work</option>
                <option value="template_save">Template Saves</option>
                <option value="avatar">Avatars</option>
                <option value="document">Documents</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-full transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 shadow-md' 
                    : 'text-purple-400 hover:text-pink-500 hover:bg-purple-50'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-full transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 shadow-md' 
                    : 'text-purple-400 hover:text-pink-500 hover:bg-purple-50'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {Object.entries(ITEM_TYPE_LABELS).map(([type, label]) => {
            const count = items.filter(item => item.type === type).length
            const IconComponent = ITEM_TYPE_ICONS[type as keyof typeof ITEM_TYPE_ICONS]
            
            return (
              <div key={type} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 p-6 hover:shadow-lg hover:shadow-purple-200/50 transition-all duration-300 hover:scale-105 group">
                <div className="flex flex-col items-center text-center">
                  <div className={`p-4 rounded-2xl mb-3 ${ITEM_TYPE_COLORS[type as keyof typeof ITEM_TYPE_COLORS]} group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent size={24} />
                  </div>
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{count}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Content */}
        {loading && pagination.offset === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-teal-500 rounded-full mb-4"></div>
            <p className="text-purple-600 font-medium flex items-center gap-2">
              <Sparkles size={16} className="animate-pulse" />
              Loading your content, queen...
              <Sparkles size={16} className="animate-pulse" />
            </p>
          </div>
        ) : error ? (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-6">
            <div className="text-center">
              <Skull size={32} className="text-pink-500 mx-auto mb-3" />
              <p className="text-pink-600 font-medium mb-4">{error}</p>
              <button
                onClick={() => loadItems()}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full font-medium transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Try Again, Babe
              </button>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <Crown size={64} className="mx-auto text-purple-400 mb-4" />
              <Sparkles size={32} className="mx-auto text-pink-400 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">No items found, queen!</h3>
            <p className="text-purple-600/80 font-medium flex items-center justify-center gap-2">
              <Heart size={16} className="text-pink-500" />
              {searchTerm || selectedType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start creating content to see it here'
              }
              <Heart size={16} className="text-pink-500" />
            </p>
          </div>
        ) : (
          <>
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {filteredItems.map(item => (
                viewMode === 'grid' ? (
                  <ItemCard key={item.id} item={item} />
                ) : (
                  <ItemRow key={item.id} item={item} />
                )
              ))}
            </div>

            {/* Load More */}
            {pagination.hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-teal-500 hover:from-purple-600 hover:via-pink-600 hover:to-teal-600 disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-300 text-white rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto group"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-b-transparent"></div>
                      Loading more magic...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} className="group-hover:animate-bounce" />
                      Load More, Queen!
                      <Crown size={16} className="opacity-70" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default UnifiedBriefcase