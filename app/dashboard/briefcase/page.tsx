'use client'

import { logError } from '@/lib/logger'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
      '#8B5CF6': 'bg-neon-purple',
      '#EC4899': 'bg-neon-magenta', 
      '#6366F1': 'bg-indigo-500',
      '#F59E0B': 'bg-neon-orange',
      '#10B981': 'bg-neon-lime',
      '#EF4444': 'bg-red-500',
      '#06B6D4': 'bg-neon-cyan',
      '#3B82F6': 'bg-blue-500',
      '#F97316': 'bg-neon-orange',
      '#84CC16': 'bg-neon-lime',
      '#A855F7': 'bg-neon-purple',
      '#F43F5E': 'bg-neon-magenta'
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
      <div className="min-h-screen bg-dark-bg relative overflow-hidden p-6">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="animate-pulse">
            <div className="h-8 bg-dark-card rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-dark-card rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg relative overflow-hidden p-6">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-sci font-bold text-white">BRIEFCASE</h1>
            <p className="text-lg text-gray-400 font-tech">Manage your business documents and files</p>
          </div>
          <div className="flex items-center gap-3">
          <Button onClick={handleCreateFolder} variant="outline" className="border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10">
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <label className="cursor-pointer">
            <Button className="bg-gradient-to-r from-neon-purple to-neon-magenta text-white hover:opacity-90">
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
        <HudBorder variant="hover" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-tech">Total Files</p>
              <p className="text-2xl font-sci font-bold text-white">{documents.length}</p>
            </div>
            <File className="w-8 h-8 text-neon-purple" />
          </div>
        </HudBorder>
        <HudBorder variant="hover" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-tech">Folders</p>
              <p className="text-2xl font-sci font-bold text-white">{folders.length}</p>
            </div>
            <FolderPlus className="w-8 h-8 text-neon-purple" />
          </div>
        </HudBorder>
        <HudBorder variant="hover" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-tech">Storage Used</p>
              <p className="text-2xl font-sci font-bold text-white">
                {formatFileSize(documents.reduce((total, doc) => total + doc.size, 0))}
              </p>
            </div>
            <Download className="w-8 h-8 text-neon-purple" />
          </div>
        </HudBorder>
        <HudBorder variant="hover" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-tech">Favorites</p>
              <p className="text-2xl font-sci font-bold text-white">{documents.filter(doc => doc.isFavorite).length}</p>
            </div>
            <Star className="w-8 h-8 text-neon-orange" />
          </div>
        </HudBorder>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-dark-card border-neon-cyan/30 text-white placeholder:text-gray-500 focus:border-neon-cyan"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-neon-cyan/30 rounded-md bg-dark-card text-white"
          aria-label="Filter by category"
        >
          {categories.map(category => (
            <option key={category} value={category} className="bg-dark-card">
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-neon-purple text-white' : 'border-neon-cyan/30 text-white hover:bg-neon-cyan/10'}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-neon-purple text-white' : 'border-neon-cyan/30 text-white hover:bg-neon-cyan/10'}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Folders */}
      {folders.length > 0 && (
        <div>
          <h2 className="text-xl font-sci font-bold text-white mb-4">FOLDERS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {folders.map(folder => (
              <HudBorder key={folder.id} variant="hover" className="cursor-pointer p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${getFolderColorClass(folder.color)}`}
                  >
                    <FolderPlus className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white font-sci">{folder.name}</h3>
                    <p className="text-sm text-gray-400 font-tech">{folder.fileCount} files</p>
                  </div>
                </div>
              </HudBorder>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      <div>
        <h2 className="text-xl font-sci font-bold text-white mb-4">DOCUMENTS</h2>
        {filteredDocuments.length === 0 ? (
          <HudBorder className="p-12 text-center">
            <File className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-sci font-bold text-white mb-2">No documents found</h3>
            <p className="text-gray-400 mb-4 font-tech">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Upload your first document to get started'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <label className="cursor-pointer">
                <Button className="bg-gradient-to-r from-neon-purple to-neon-magenta text-white hover:opacity-90">
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
          </HudBorder>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-2"}>
            {filteredDocuments.map(doc => (
              <HudBorder key={doc.id} variant="hover" className="cursor-pointer">
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
                          <DropdownMenuContent className="bg-dark-card border-neon-cyan/30">
                            <DropdownMenuItem onClick={() => window.open(`/api/briefcase/files/${doc.id}/download`, '_blank')} className="text-white hover:bg-dark-bg">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-dark-bg">
                              <Share className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-neon-cyan/30" />
                            <DropdownMenuItem className="text-white hover:bg-dark-bg">
                              <Star className="w-4 h-4 mr-2" />
                              {doc.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm truncate text-white font-sci" title={doc.name}>
                          {doc.name}
                        </h3>
                        <p className="text-xs text-gray-400 font-tech">{formatFileSize(doc.size)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="text-xs bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30">
                            {doc.category}
                          </Badge>
                          {doc.isFavorite && (
                            <Star className="w-3 h-3 text-neon-orange fill-current" />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      {getFileIcon(doc.fileType)}
                      <div className="flex-1">
                        <h3 className="font-medium text-white font-sci">{doc.name}</h3>
                        <p className="text-sm text-gray-400 font-tech">
                          {formatFileSize(doc.size)} • {doc.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30">{doc.fileType.toUpperCase()}</Badge>
                        {doc.isFavorite && (
                          <Star className="w-4 h-4 text-neon-orange fill-current" />
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-dark-bg">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-dark-card border-neon-cyan/30">
                            <DropdownMenuItem onClick={() => window.open(`/api/briefcase/files/${doc.id}/download`, '_blank')} className="text-white hover:bg-dark-bg">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-dark-bg">
                              <Share className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-neon-cyan/30" />
                            <DropdownMenuItem className="text-white hover:bg-dark-bg">
                              <Star className="w-4 h-4 mr-2" />
                              {doc.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )}
                </div>
              </HudBorder>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}