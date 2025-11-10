'use client'

import { logError } from '@/lib/logger'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { GlassCard, CamoBackground, TacticalGrid } from '@/components/military'
import { 
  Upload, 
  Search, 
  Grid3X3, 
  List, 
  FolderPlus, 
  FileText, 
  Image, 
  File,
  Download,
  Share,
  MoreVertical,
  Star
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Document {
  id: string
  name: string
  originalName: string
  fileType: string
  mimeType: string
  size: number
  fileUrl?: string
  category: string
  description?: string
  tags: string[]
  isFavorite: boolean
  isPublic: boolean
  downloadCount: number
  viewCount: number
  lastAccessed?: string
  createdAt: string
  updatedAt: string
  folderId?: number
}

interface Folder {
  id: number
  name: string
  description?: string
  color: string
  icon?: string
  fileCount: number
  totalSize: number
  createdAt: string
  updatedAt: string
}

export default function BriefcasePage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  // Note: selectedDocuments removed - not implemented in current UI

  // Helper function to map folder colors to Tailwind classes
  const getFolderColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      '#8B5CF6': 'bg-purple-500',
      '#EC4899': 'bg-pink-500', 
      '#6366F1': 'bg-indigo-500',
      '#F59E0B': 'bg-yellow-500',
      '#10B981': 'bg-emerald-500',
      '#EF4444': 'bg-red-500',
      '#06B6D4': 'bg-cyan-500',
      '#3B82F6': 'bg-blue-500',
      '#F97316': 'bg-orange-500',
      '#84CC16': 'bg-lime-500',
      '#A855F7': 'bg-violet-500',
      '#F43F5E': 'bg-rose-500'
    }
    return colorMap[color] || 'bg-gray-500'
  }

  useEffect(() => {
    loadDocuments()
    loadFolders()
  }, [])

  const loadDocuments = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/briefcase/files', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents || [])
      }
    } catch (error) {
      logError('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFolders = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/briefcase/folders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFolders(data.folders || [])
      }
    } catch (error) {
      logError('Error loading folders:', error)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      const token = localStorage.getItem('auth_token')
      const formData = new FormData()

      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }

      const response = await fetch('/api/briefcase/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        await loadDocuments()
      }
    } catch (error) {
      logError('Error uploading files:', error)
    }
  }

  const handleCreateFolder = async () => {
    const name = prompt('Enter folder name:')
    if (!name) return

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/briefcase/folders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      })

      if (response.ok) {
        await loadFolders()
      }
    } catch (error) {
      logError('Error creating folder:', error)
    }
  }


  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <Image className="w-5 h-5 text-blue-500" />
      default:
        return <File className="w-5 h-5 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const categories = ['all', ...new Set(documents.map(doc => doc.category))]

  if (loading) {
    return (
      <div className="min-h-screen bg-military-midnight relative overflow-hidden p-6">
        <CamoBackground opacity={0.1} withGrid />
        <TacticalGrid />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="animate-pulse">
            <div className="h-8 bg-military-tactical-black/50 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-military-tactical-black/50 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-military-midnight relative overflow-hidden p-6">
      <CamoBackground opacity={0.1} withGrid />
      <TacticalGrid />
      
      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-heading font-bold text-military-glass-white">Briefcase</h1>
            <p className="text-lg text-military-storm-grey">Manage your business documents and files</p>
          </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleCreateFolder} variant="outline" className="border-military-storm-grey text-military-glass-white hover:bg-military-tactical-black">
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <label className="cursor-pointer">
            <Button className="bg-gradient-to-r from-military-hot-pink to-military-blush-pink text-white hover:opacity-90">
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
            />
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4" glow>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-military-storm-grey">Total Files</p>
              <p className="text-2xl font-bold text-military-glass-white">{documents.length}</p>
            </div>
            <File className="w-8 h-8 text-military-hot-pink" />
          </div>
        </GlassCard>
        <GlassCard className="p-4" glow>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-military-storm-grey">Folders</p>
              <p className="text-2xl font-bold text-military-glass-white">{folders.length}</p>
            </div>
            <FolderPlus className="w-8 h-8 text-military-hot-pink" />
          </div>
        </GlassCard>
        <GlassCard className="p-4" glow>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-military-storm-grey">Storage Used</p>
              <p className="text-2xl font-bold text-military-glass-white">
                {formatFileSize(documents.reduce((total, doc) => total + doc.size, 0))}
              </p>
            </div>
            <Download className="w-8 h-8 text-military-hot-pink" />
          </div>
        </GlassCard>
        <GlassCard className="p-4" glow>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-military-storm-grey">Favorites</p>
              <p className="text-2xl font-bold text-military-glass-white">{documents.filter(doc => doc.isFavorite).length}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </GlassCard>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-military-storm-grey w-4 h-4" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-military-tactical-black/50 border-military-storm-grey text-military-glass-white placeholder:text-military-storm-grey"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-military-storm-grey rounded-md bg-military-tactical-black/50 text-military-glass-white"
          aria-label="Filter by category"
        >
          {categories.map(category => (
            <option key={category} value={category} className="bg-military-tactical-black">
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-military-hot-pink text-white' : 'border-military-storm-grey text-military-glass-white'}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-military-hot-pink text-white' : 'border-military-storm-grey text-military-glass-white'}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Folders */}
      {folders.length > 0 && (
        <div>
          <h2 className="text-xl font-heading font-bold text-military-glass-white mb-4">Folders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {folders.map(folder => (
              <GlassCard key={folder.id} className="cursor-pointer hover:shadow-md transition-shadow p-4" glow>
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${getFolderColorClass(folder.color)}`}
                  >
                    <FolderPlus className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-military-glass-white">{folder.name}</h3>
                    <p className="text-sm text-military-storm-grey">{folder.fileCount} files</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      <div>
        <h2 className="text-xl font-heading font-bold text-military-glass-white mb-4">Documents</h2>
        {filteredDocuments.length === 0 ? (
          <GlassCard className="p-12 text-center" glow>
            <File className="w-12 h-12 text-military-storm-grey mx-auto mb-4" />
            <h3 className="text-lg font-heading font-bold text-military-glass-white mb-2">No documents found</h3>
            <p className="text-military-storm-grey mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Upload your first document to get started'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <label className="cursor-pointer">
                <Button className="bg-gradient-to-r from-military-hot-pink to-military-blush-pink text-white hover:opacity-90">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                />
              </label>
            )}
          </GlassCard>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "space-y-2"
          }>
            {filteredDocuments.map(doc => (
              <GlassCard key={doc.id} className="cursor-pointer hover:shadow-md transition-shadow" glow>
                <div className={viewMode === 'grid' ? 'p-4' : 'p-3'}>
                  {viewMode === 'grid' ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        {getFileIcon(doc.fileType)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-military-tactical-black border-military-storm-grey">
                            <DropdownMenuItem onClick={() => window.open(`/api/briefcase/files/${doc.id}/download`, '_blank')} className="text-military-glass-white hover:bg-military-midnight">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-military-glass-white hover:bg-military-midnight">
                              <Share className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-military-storm-grey" />
                            <DropdownMenuItem className="text-military-glass-white hover:bg-military-midnight">
                              <Star className="w-4 h-4 mr-2" />
                              {doc.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm truncate text-military-glass-white" title={doc.name}>
                          {doc.name}
                        </h3>
                        <p className="text-xs text-military-storm-grey">{formatFileSize(doc.size)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs bg-military-tactical-black/50 text-military-storm-grey border-white/10">
                            {doc.category}
                          </Badge>
                          {doc.isFavorite && (
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      {getFileIcon(doc.fileType)}
                      <div className="flex-1">
                        <h3 className="font-medium text-military-glass-white">{doc.name}</h3>
                        <p className="text-sm text-military-storm-grey">
                          {formatFileSize(doc.size)} • {doc.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-military-tactical-black/50 text-military-storm-grey border-white/10">{doc.fileType.toUpperCase()}</Badge>
                        {doc.isFavorite && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-military-glass-white hover:bg-military-tactical-black">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-military-tactical-black border-military-storm-grey">
                            <DropdownMenuItem onClick={() => window.open(`/api/briefcase/files/${doc.id}/download`, '_blank')} className="text-military-glass-white hover:bg-military-midnight">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-military-glass-white hover:bg-military-midnight">
                              <Share className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-military-storm-grey" />
                            <DropdownMenuItem className="text-military-glass-white hover:bg-military-midnight">
                              <Star className="w-4 h-4 mr-2" />
                              {doc.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}