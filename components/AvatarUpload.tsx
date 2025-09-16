'use client'
import React, { useState, useRef } from 'react'
import { Upload, Camera, X, Crown, Heart, Sparkles } from 'lucide-react'
import Image from 'next/image'

interface Avatar {
  id: string
  url: string
  filename: string
  size: number
  mimeType: string
  uploadedAt: string
}

interface AvatarUploadProps {
  currentAvatar?: Avatar | null
  onAvatarChange?: (avatar: Avatar | null) => void
  className?: string
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  currentAvatar, 
  onAvatarChange,
  className = '' 
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Clear any previous errors
    setError(null)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB')
      return
    }

    // Create preview
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    try {
      setIsUploading(true)
      
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/avatar/upload', {
        method: 'POST',
        headers: {
          ...(typeof window !== 'undefined' && localStorage.getItem('authToken')
            ? { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            : {})
        },
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      // Notify parent component of the new avatar
      onAvatarChange?.(result.avatar)
      
      // Clear preview URL since we have the real URL now
      URL.revokeObjectURL(url)
      setPreviewUrl(null)

    } catch (error) {
      console.error('Avatar upload error:', error)
      setError(error instanceof Error ? error.message : 'Upload failed')
      
      // Clean up preview on error
      URL.revokeObjectURL(url)
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveAvatar = async () => {
    if (!currentAvatar) return

    try {
      setIsUploading(true)
      
      const response = await fetch(`/api/unified-briefcase?id=${currentAvatar.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to remove avatar')
      }

      onAvatarChange?.(null)

    } catch (error) {
      console.error('Avatar removal error:', error)
      setError(error instanceof Error ? error.message : 'Failed to remove avatar')
    } finally {
      setIsUploading(false)
    }
  }

  const displayUrl = previewUrl || currentAvatar?.url
  const showPlaceholder = !displayUrl && !isUploading

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-200 via-pink-200 to-teal-200 border-4 border-white shadow-lg shadow-purple-200/50 overflow-hidden group cursor-pointer hover:shadow-xl hover:shadow-pink-300/60 transition-all duration-300 hover:scale-105">
          {showPlaceholder ? (
            <div 
              className="w-full h-full flex items-center justify-center text-purple-400 group-hover:text-pink-500 transition-colors relative"
              onClick={() => fileInputRef.current?.click()}
            >
              <Crown size={28} className="relative z-10" />
              <Sparkles size={16} className="absolute top-2 right-2 text-teal-400 animate-pulse" />
              <Heart size={12} className="absolute bottom-2 left-2 text-pink-400 animate-bounce" />
            </div>
          ) : displayUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={displayUrl}
                alt="Profile avatar"
                fill
                className="object-cover"
                sizes="96px"
              />
              <div 
                className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-teal-500/0 group-hover:from-purple-500/30 group-hover:via-pink-500/30 group-hover:to-teal-500/30 transition-all duration-300 flex items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                  <Camera 
                    size={18} 
                    className="text-white drop-shadow-lg" 
                  />
                  <Sparkles size={14} className="text-white animate-pulse" />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          )}
        </div>

        {/* Remove avatar button */}
        {currentAvatar && !isUploading && (
          <button
            onClick={handleRemoveAvatar}
            className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
            title="Remove avatar"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Upload controls */}
      <div className="mt-4 flex flex-col items-center">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-teal-500 hover:from-purple-600 hover:via-pink-600 hover:to-teal-600 disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-300 text-white rounded-full transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 group"
        >
          <Upload size={16} className="group-hover:animate-bounce" />
          {currentAvatar ? 'Change Avatar' : 'Upload Avatar'}
          <Crown size={14} className="opacity-70" />
        </button>

        <p className="text-xs text-purple-600/70 mt-2 text-center font-medium">
          ✨ JPG, PNG or WebP • Max 5MB ✨
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg shadow-sm">
          <p className="text-sm text-pink-600 font-medium flex items-center gap-2">
            <Heart size={14} className="text-pink-500" />
            {error}
          </p>
        </div>
      )}
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        aria-label="Upload avatar image"
        title="Upload avatar image"
        className="hidden"
        disabled={isUploading}
      />
    </div>
  )
}

export default AvatarUpload