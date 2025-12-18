"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import { Button} from '@/components/ui/button'
import { Input} from '@/components/ui/input'
import { Label} from '@/components/ui/label'
import { Textarea} from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import { Folder, Palette} from 'lucide-react'

interface FolderCreationDialogProps {
  isOpen: boolean
  onCloseAction: () => void
  onCreateFolderAction: (name: string, description?: string, color?: string, parentId?: string) => void
  parentFolder?: string
  availableFolders?: Array<{ id: string; name: string; color: string }>
}

const FOLDER_COLORS = [
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Teal', value: '#14B8A6' },
]

export default function FolderCreationDialog({ 
  isOpen, 
  onCloseAction, 
  onCreateFolderAction, 
  parentFolder,
  availableFolders = []
}: FolderCreationDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#8B5CF6')
  const [selectedParentId, setSelectedParentId] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      await onCreateFolderAction(name.trim(), description.trim() || undefined, color, selectedParentId === '__root__' ? undefined : selectedParentId || undefined)
      // Reset form
      setName('')
      setDescription('')
      setColor('#8B5CF6')
      setSelectedParentId('')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setName('')
      setDescription('')
      setColor('#8B5CF6')
      setSelectedParentId('')
      onCloseAction()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-purple-600" />
            Create New Folder
          </DialogTitle>
          <DialogDescription>
            {parentFolder 
              ? `Create a new folder inside "${parentFolder}"`
              : 'Create a new folder to organize your files'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name..."
              required
              disabled={loading}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="folder-description">Description (Optional)</Label>
            <Textarea
              id="folder-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this folder contains..."
              disabled={loading}
              className="mt-1"
              rows={3}
            />
          </div>

          {availableFolders.length > 0 && (
            <div>
              <Label htmlFor="parent-folder">Parent Folder (Optional)</Label>
              <Select value={selectedParentId} onValueChange={setSelectedParentId} disabled={loading}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select parent folder..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__root__">Root Level</SelectItem>
                  {availableFolders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-200"
                        aria-hidden="true"
                      />
                      {folder.name}
                    </div>
                  </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Folder Color
            </Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {FOLDER_COLORS.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  onClick={() => setColor(colorOption.value)}
                  disabled={loading}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === colorOption.value 
                      ? 'border-gray-900 scale-110' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: colorOption.value }}
                  title={colorOption.name}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Creating...' : 'Create Folder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
