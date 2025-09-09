"use client"

import { useState, useEffect, useCallback, useRef } from "react"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { Progress } from "@/components/ui/progress"
import { 
  Briefcase, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Music,
  Archive,
  Search,
  Grid3x3,
  List,
  Trash2,
  FolderPlus,
  Folder,
  FileSpreadsheet,
  FileType,
  FileCode,
  Loader2,
  Download,
  Brain,
  Share2,
  History,
  CheckSquare,
  Square
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import FilePreviewModal from "@/components/file-preview-modal"
import EnhancedFilePreviewModal from "@/components/briefcase/enhanced-file-preview-modal"
import FolderCreationDialog from "@/components/briefcase/folder-creation-dialog"
import AdvancedSearchPanel, { SearchFilters } from "@/components/briefcase/advanced-search-panel"
import AIInsightsPanel from "@/components/briefcase/ai-insights-panel"
import FileSharingModal from "@/components/briefcase/file-sharing-modal"
import VersionHistoryModal from "@/components/briefcase/version-history-modal"
import BulkOperationsPanel from "@/components/briefcase/bulk-operations-panel"

interface BriefcaseFile {
  id: string
  name: string
  original_name: string
  file_type: string
  mime_type: string
  size: number
  category: string
  description?: string
  tags: string[]
  metadata: any
  ai_insights: any
  is_favorite: boolean
  download_count: number
  view_count: number
  last_accessed?: string
  created_at: string
  updated_at: string
  folder_id?: number
  folder_name?: string
  folder_color?: string
  downloadUrl: string
  previewUrl: string
}

interface Folder {
  id: string
  name: string
  description?: string
  created_at: string
  color: string
  file_count: number
}

export default function BriefcasePage() {
  const [files, setFiles] = useState<BriefcaseFile[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showFolderDialog, setShowFolderDialog] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    categories: [],
    fileTypes: []
  })
  
  // Preview modal state
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [_previewFile, setPreviewFile] = useState<BriefcaseFile | null>(null)
  const [previewIndex, setPreviewIndex] = useState(0)
  
  // AI insights state
  const [showAIInsights, setShowAIInsights] = useState(false)
  const [aiInsightsFile, setAiInsightsFile] = useState<BriefcaseFile | null>(null)
  
  // File sharing state
  const [showSharingModal, setShowSharingModal] = useState(false)
  const [sharingFile, setSharingFile] = useState<BriefcaseFile | null>(null)
  
  // Version history state
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [versionHistoryFile, setVersionHistoryFile] = useState<BriefcaseFile | null>(null)
  
  // Bulk operations state
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [showBulkOperations, setShowBulkOperations] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  
  // Mobile optimization state
  const [_isRefreshing, setIsRefreshing] = useState(false)
  const [_lastTouchY, setLastTouchY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Advanced search state
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    semantic: false,
    fileTypes: [],
    categories: [],
    tags: [],
    dateRange: undefined,
    sizeRange: [0, 1000],
    authors: [],
    favorites: false,
    folders: [],
    sortBy: 'relevance',
    sortOrder: 'desc',
    includeContent: true,
    includeComments: false
  })
  const [searchResults, setSearchResults] = useState<BriefcaseFile[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchStats, setSearchStats] = useState({
    fileTypes: [],
    categories: [],
    tags: []
  })

  const { toast } = useToast()

  // Fetch files from API
  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedFolder) params.append('folder', selectedFolder)
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await fetch(`/api/briefcase?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch files')
      
      const data = await response.json()
      setFiles(data.files || [])
      setStats(data.stats || { totalFiles: 0, totalSize: 0, categories: [], fileTypes: [] })
    } catch (error) {
      console.error('Error fetching files:', error)
      toast({
        title: "Error",
        description: "Failed to load files. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, selectedFolder, searchTerm, toast])

  // Fetch folders
  const fetchFolders = useCallback(async () => {
    try {
      const response = await fetch('/api/briefcase/folders')
      if (response.ok) {
        const data = await response.json()
        setFolders(data.folders || [])
      }
    } catch (error) {
      console.error('Error fetching folders:', error)
    }
  }, [])

  // Advanced search function
  const performAdvancedSearch = useCallback(async (filters: SearchFilters) => {
    try {
      setIsSearching(true)
      const response = await fetch('/api/briefcase/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      })
      
      if (!response.ok) throw new Error('Search failed')
      
      const data = await response.json()
      setSearchResults(data.files || [])
      setSearchStats(data.stats || { fileTypes: [], categories: [], tags: [] })
      
      toast({
        title: "Search completed",
        description: `Found ${data.files?.length || 0} files`,
      })
    } catch (error) {
      console.error('Search error:', error)
      toast({
        title: "Search failed",
        description: "Failed to perform search. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSearching(false)
    }
  }, [toast])

  // Initial load
  useEffect(() => {
    fetchFiles()
    fetchFolders()
  }, [fetchFiles, fetchFolders])

  // Handle file upload
  const handleFileUpload = async (files: FileList | null, folderId?: string, category?: string) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }
      
      formData.append('category', category || selectedCategory)
      if (folderId) formData.append('folderId', folderId)
      formData.append('description', '')
      formData.append('tags', '')

      const response = await fetch('/api/briefcase/upload', {
        method: 'PUT', // Use PUT for bulk upload
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const result = await response.json()
      
      toast({
        title: "Success!",
        description: `Uploaded ${result.uploaded} file(s) successfully.`
      })

      setShowUploadDialog(false)
      fetchFiles() // Refresh the file list
      fetchFolders() // Refresh folders to update counts
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload files. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // Handle file preview
  const handleFilePreview = (file: BriefcaseFile, index: number) => {
    setPreviewFile(file)
    setPreviewIndex(index)
    setShowPreviewModal(true)
  }

  // Handle AI insights
  const handleAIInsights = (file: BriefcaseFile) => {
    setAiInsightsFile(file)
    setShowAIInsights(true)
  }

  // Handle file sharing
  const handleFileSharing = (file: BriefcaseFile) => {
    setSharingFile(file)
    setShowSharingModal(true)
  }

  // Handle version history
  const handleVersionHistory = (file: BriefcaseFile) => {
    setVersionHistoryFile(file)
    setShowVersionHistory(true)
  }

  // Handle file metadata operations
  const handleToggleFavorite = async (file: BriefcaseFile) => {
    try {
      const response = await fetch(`/api/briefcase/files/${file.id}/favorite`, {
        method: 'POST'
      })

      if (!response.ok) throw new Error('Failed to toggle favorite')

      const result = await response.json()
      
      // Update the file in the local state
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, is_favorite: result.isFavorite } : f
      ))

      toast({
        title: result.isFavorite ? "Added to favorites" : "Removed from favorites",
        description: `"${file.name}" ${result.isFavorite ? 'added to' : 'removed from'} your favorites`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive"
      })
    }
  }

  const handleAddTag = async (file: BriefcaseFile, tag: string) => {
    try {
      const response = await fetch(`/api/briefcase/files/${file.id}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag })
      })

      if (!response.ok) throw new Error('Failed to add tag')

      const result = await response.json()
      
      // Update the file in the local state
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, tags: result.tags } : f
      ))

      toast({
        title: "Tag added",
        description: `Added "${tag}" to "${file.name}"`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive"
      })
    }
  }

  const handleRemoveTag = async (file: BriefcaseFile, tag: string) => {
    try {
      const response = await fetch(`/api/briefcase/files/${file.id}/tags?tag=${encodeURIComponent(tag)}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to remove tag')

      const result = await response.json()
      
      // Update the file in the local state
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, tags: result.tags } : f
      ))

      toast({
        title: "Tag removed",
        description: `Removed "${tag}" from "${file.name}"`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove tag",
        variant: "destructive"
      })
    }
  }

  const handleUpdateDescription = async (file: BriefcaseFile, description: string) => {
    try {
      const response = await fetch(`/api/briefcase/files/${file.id}/metadata`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      })

      if (!response.ok) throw new Error('Failed to update description')

      const result = await response.json()
      
      // Update the file in the local state
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, description: result.document.description } : f
      ))

      toast({
        title: "Description updated",
        description: `Updated description for "${file.name}"`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update description",
        variant: "destructive"
      })
    }
  }

  // Bulk operations handlers
  const handleFileSelection = (fileId: string, selected: boolean) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(fileId)
      } else {
        newSet.delete(fileId)
      }
      return newSet
    })
  }

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedFiles(new Set(filteredFiles.map(f => f.id)))
    } else {
      setSelectedFiles(new Set())
    }
    setSelectAll(selected)
  }

  const handleBulkOperationComplete = () => {
    setSelectedFiles(new Set())
    setSelectAll(false)
    setShowBulkOperations(false)
    fetchFiles() // Refresh the file list
  }

  // Handle folder creation
  const handleCreateFolder = async (name: string, description?: string, color?: string) => {
    try {
      const response = await fetch('/api/briefcase/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          color: color || '#8B5CF6',
          parentId: selectedFolder
        })
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: `Folder "${name}" created successfully.`
        })
        fetchFolders()
        setShowFolderDialog(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create folder')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create folder",
        variant: "destructive"
      })
    }
  }

  // Handle file download
  const handleFileDownload = async (file: BriefcaseFile) => {
    try {
      const response = await fetch(`/api/briefcase/${file.id}/download`)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast({
        title: "Download Started",
        description: `${file.name} is being downloaded.`
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Download Failed",
        description: "Failed to download file. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Handle file deletion
  const handleFileDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const response = await fetch(`/api/briefcase/${fileId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Delete failed')

      toast({
        title: "File Deleted",
        description: "File has been deleted successfully."
      })

      fetchFiles() // Refresh the file list
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete file. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <ImageIcon className="w-5 h-5" />
    if (type.includes('video')) return <Video className="w-5 h-5" />
    if (type.includes('audio')) return <Music className="w-5 h-5" />
    if (type.includes('pdf')) return <FileText className="w-5 h-5" />
    if (type.includes('spreadsheet') || type.includes('excel')) return <FileSpreadsheet className="w-5 h-5" />
    if (type.includes('code') || type.includes('text')) return <FileCode className="w-5 h-5" />
    if (type.includes('zip') || type.includes('archive')) return <Archive className="w-5 h-5" />
    return <FileType className="w-5 h-5" />
  }

  // Use search results if available, otherwise filter regular files
  const filteredFiles = searchResults.length > 0 ? searchResults : files.filter(file => {
    const matchesSearch = !searchTerm || 
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (file.description && file.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-6 space-y-6" ref={containerRef}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 via-teal-500 to-pink-500 rounded-full flex items-center justify-center"
            >
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-teal-600 to-pink-600 bg-clip-text text-transparent">
                Briefcase
              </h1>
              <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                {stats.totalFiles} files • {formatFileSize(stats.totalSize)}
              </p>
            </div>
          </div>
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button 
              onClick={() => setSelectedFolder(null)}
              className="hover:text-purple-600 transition-colors"
            >
              All Files
            </button>
            {selectedFolder && (
              <>
                <span>/</span>
                <span className="text-purple-600 font-medium">
                  {folders.find(f => f.id.toString() === selectedFolder)?.name || 'Folder'}
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => setShowUploadDialog(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowFolderDialog(true)}
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex gap-6">
        {/* Folder Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-lg border p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Folder className="w-4 h-4" />
              Folders
            </h3>
            
            <div className="space-y-1">
              <button
                onClick={() => setSelectedFolder(null)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  !selectedFolder 
                    ? 'bg-purple-100 text-purple-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  All Files
                  <span className="ml-auto text-xs text-gray-500">
                    {stats.totalFiles}
                  </span>
                </div>
              </button>
              
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id.toString())}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedFolder === folder.id.toString()
                      ? 'bg-purple-100 text-purple-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: folder.color }}
                    />
                    {folder.name}
                    <span className="ml-auto text-xs text-gray-500">
                      {folder.file_count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Advanced Search Panel */}
          <AdvancedSearchPanel
            filters={searchFilters}
            onFiltersChange={setSearchFilters}
            onSearch={performAdvancedSearch}
            availableFileTypes={stats.fileTypes.map((ft: any) => ft.file_type)}
            availableCategories={stats.categories.map((cat: any) => cat.name)}
            availableTags={stats.categories.map((cat: any) => ({ name: cat.name, count: cat.count }))}
            availableAuthors={[]} // TODO: Implement authors
            availableFolders={folders.map(f => ({ name: f.name, id: f.id.toString(), count: f.file_count }))}
            totalFiles={stats.totalFiles}
          />

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Bulk Operations */}
            {selectedFiles.size > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowBulkOperations(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Bulk Operations ({selectedFiles.size})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFiles(new Set())
                    setSelectAll(false)
                  }}
                >
                  Clear Selection
                </Button>
              </div>
            )}

            {/* Search Results Toggle */}
            {searchResults.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant={showAdvancedSearch ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Results ({searchResults.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchResults([])
                    setSearchFilters({
                      query: '',
                      semantic: false,
                      fileTypes: [],
                      categories: [],
                      tags: [],
                      dateRange: undefined,
                      sizeRange: [0, 1000],
                      authors: [],
                      favorites: false,
                      folders: [],
                      sortBy: 'relevance',
                      sortOrder: 'desc',
                      includeContent: true,
                      includeComments: false
                    })
                  }}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>

      {/* Files Grid/List */}
      {loading || isSearching ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">
            {isSearching ? 'Searching...' : 'Loading files...'}
          </span>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-600 mb-4">
            {searchResults.length > 0 
              ? 'No files match your search criteria. Try adjusting your filters.'
              : searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Upload your first file to get started'
            }
          </p>
          {searchResults.length === 0 && !searchTerm && selectedCategory === 'all' && (
            <Button
              onClick={() => setShowUploadDialog(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Select All Header */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSelectAll(!selectAll)}
                className="p-1"
              >
                {selectAll ? (
                  <CheckSquare className="w-4 h-4 text-purple-600" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
              </Button>
              <span className="text-sm font-medium">
                {selectAll ? 'All selected' : 'Select all'} ({filteredFiles.length} files)
              </span>
            </div>
            {selectedFiles.size > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBulkOperations(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Bulk Actions ({selectedFiles.size})
              </Button>
            )}
          </div>

          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            : "space-y-2"
          }>
            {filteredFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={viewMode === 'grid' 
                ? `group relative bg-white rounded-lg border transition-all duration-200 cursor-pointer ${
                    selectedFiles.has(file.id) 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
                  }`
                : `group flex items-center space-x-4 bg-white rounded-lg border transition-all duration-200 cursor-pointer p-4 ${
                    selectedFiles.has(file.id) 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
                  }`
              }
              onClick={(e) => {
                // Don't trigger preview if clicking on checkbox
                if ((e.target as HTMLElement).closest('[data-checkbox]')) {
                  return
                }
                handleFilePreview(file, index)
              }}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFileSelection(file.id, !selectedFiles.has(file.id))
                          }}
                          className="p-1"
                          data-checkbox
                        >
                          {selectedFiles.has(file.id) ? (
                            <CheckSquare className="w-4 h-4 text-purple-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </Button>
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          {getFileIcon(file.file_type)}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAIInsights(file)
                          }}
                          title="AI Analysis"
                        >
                          <Brain className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFileSharing(file)
                          }}
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleVersionHistory(file)
                          }}
                          title="Version History"
                        >
                          <History className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFileDownload(file)
                          }}
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-medium text-sm text-gray-900 truncate">{file.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFileSelection(file.id, !selectedFiles.has(file.id))
                    }}
                    className="p-1"
                    data-checkbox
                  >
                    {selectedFiles.has(file.id) ? (
                      <CheckSquare className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    {getFileIcon(file.file_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-900 truncate">{file.name}</h3>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAIInsights(file)
                      }}
                      title="AI Analysis"
                    >
                      <Brain className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFileSharing(file)
                      }}
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleVersionHistory(file)
                      }}
                      title="Version History"
                    >
                      <History className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFileDownload(file)
                      }}
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFileDelete(file.id)
                      }}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
          </div>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Select files to upload to your briefcase
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="files">Files</Label>
              <Input
                id="files"
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                disabled={isUploading}
              />
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

          {/* Enhanced File Preview Modal */}
          <EnhancedFilePreviewModal
            isOpen={showPreviewModal}
            onClose={() => setShowPreviewModal(false)}
            file={filteredFiles[previewIndex] || null}
            files={filteredFiles}
            currentIndex={previewIndex}
            onNavigate={(direction) => {
              if (direction === 'prev' && previewIndex > 0) {
                setPreviewIndex(previewIndex - 1)
              } else if (direction === 'next' && previewIndex < filteredFiles.length - 1) {
                setPreviewIndex(previewIndex + 1)
              }
            }}
            onEdit={(file) => {
              // TODO: Implement file editing
              console.log('Edit file:', file.name)
            }}
            onDelete={handleFileDelete}
            onShare={handleFileSharing}
            onDownload={handleFileDownload}
            onToggleFavorite={handleToggleFavorite}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            onUpdateDescription={handleUpdateDescription}
            onUpdateCategory={(file, category) => {
              // TODO: Implement category update
              console.log('Update category:', file.name, category)
            }}
          />

          {/* Folder Creation Dialog */}
          <FolderCreationDialog
            isOpen={showFolderDialog}
            onCloseAction={() => setShowFolderDialog(false)}
            onCreateFolderAction={handleCreateFolder}
            parentFolder={selectedFolder ? folders.find(f => f.id.toString() === selectedFolder)?.name : undefined}
          />

          {/* AI Insights Panel */}
          {showAIInsights && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <AIInsightsPanel
                  file={aiInsightsFile}
                  onClose={() => {
                    setShowAIInsights(false)
                    setAiInsightsFile(null)
                  }}
                />
              </div>
            </div>
          )}

          {/* File Sharing Modal */}
          {showSharingModal && sharingFile && (
            <FileSharingModal
              isOpen={showSharingModal}
              onClose={() => {
                setShowSharingModal(false)
                setSharingFile(null)
              }}
              file={sharingFile}
              currentUserId="current-user-id" // TODO: Get from auth context
              currentUserName="Current User" // TODO: Get from auth context
            />
          )}

          {/* Version History Modal */}
          {showVersionHistory && versionHistoryFile && (
            <VersionHistoryModal
              isOpen={showVersionHistory}
              onClose={() => {
                setShowVersionHistory(false)
                setVersionHistoryFile(null)
              }}
              file={versionHistoryFile}
              currentUserId="current-user-id" // TODO: Get from auth context
            />
          )}

          {/* Bulk Operations Modal */}
          {showBulkOperations && selectedFiles.size > 0 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <BulkOperationsPanel
                    selectedFiles={filteredFiles.filter(f => selectedFiles.has(f.id))}
                    availableFolders={folders}
                    onClose={() => setShowBulkOperations(false)}
                    onOperationComplete={handleBulkOperationComplete}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
