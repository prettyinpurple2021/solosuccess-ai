import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { createClient } from '@/lib/neon/server'
import { v4 as uuidv4 } from 'uuid'
import { headers } from 'next/headers'

// File type validation
const ALLOWED_FILE_TYPES = {
  'image/': ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  'application/pdf': ['pdf'],
  'text/': ['txt', 'md', 'csv', 'json', 'xml', 'html', 'css', 'js', 'ts', 'jsx', 'tsx'],
  'application/msword': ['doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
  'application/vnd.ms-excel': ['xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx'],
  'application/vnd.ms-powerpoint': ['ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['pptx'],
  'video/': ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
  'audio/': ['mp3', 'wav', 'ogg', 'm4a', 'aac'],
  'application/zip': ['zip'],
  'application/x-rar-compressed': ['rar'],
  'application/x-7z-compressed': ['7z'],
}

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

function getFileTypeFromMime(mimeType: string): string {
  for (const [mime, extensions] of Object.entries(ALLOWED_FILE_TYPES)) {
    if (mimeType.startsWith(mime)) {
      return extensions[0] || 'unknown'
    }
  }
  return 'unknown'
}

function isFileTypeAllowed(mimeType: string): boolean {
  for (const mime of Object.keys(ALLOWED_FILE_TYPES)) {
    if (mimeType.startsWith(mime)) {
      return true
    }
  }
  return false
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folderId = formData.get('folderId') as string
    const category = formData.get('category') as string || 'uncategorized'
    const description = formData.get('description') as string
    const tags = formData.get('tags') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      }, { status: 400 })
    }

    // Validate file type
    if (!isFileTypeAllowed(file.type)) {
      return NextResponse.json({ 
        error: 'File type not allowed' 
      }, { status: 400 })
    }

    // Generate unique file ID
    const fileId = uuidv4()
    
    // Get file buffer
    const fileBuffer = await file.arrayBuffer()
    const fileData = Buffer.from(fileBuffer)

    // Save document metadata to database
    const client = await createClient()
    
    // Parse tags
    const parsedTags = tags ? JSON.parse(tags) : []
    
    // Insert document record with file data
    const { rows: [document] } = await client.query(`
      INSERT INTO documents (
        id, user_id, folder_id, name, original_name, file_type, mime_type, 
        size, file_data, category, description, tags, 
        metadata, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
      RETURNING *
    `, [
      fileId,
      user.id,
      folderId || null,
      file.name,
      file.name,
      getFileTypeFromMime(file.type),
      file.type,
      file.size,
      fileData, // Store file data directly in database
      category,
      description || null,
      JSON.stringify(parsedTags),
      JSON.stringify({
        originalSize: file.size,
        uploadedAt: new Date().toISOString(),
        userAgent: (await headers()).get('user-agent'),
      })
    ])

    // Update folder file count if folder specified
    if (folderId) {
      await client.query(`
        UPDATE document_folders 
        SET file_count = file_count + 1, 
            total_size = total_size + $1,
            updated_at = NOW()
        WHERE id = $2 AND user_id = $3
      `, [file.size, folderId, user.id])
    }

    // Log activity
    await client.query(`
      INSERT INTO document_activity (document_id, user_id, action, details, created_at)
      VALUES ($1, $2, 'uploaded', $3, NOW())
    `, [
      fileId,
      user.id,
      JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        category,
        folderId: folderId || null,
      })
    ])

    // Return success response
    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        name: document.name,
        type: document.file_type,
        size: document.size,
        category: document.category,
        description: document.description,
        tags: parsedTags,
        createdAt: document.created_at,
        updatedAt: document.updated_at,
        downloadUrl: `/api/briefcase/files/${fileId}/download`,
        previewUrl: `/api/briefcase/files/${fileId}/preview`,
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// Handle multiple file uploads
export async function PUT(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const folderId = formData.get('folderId') as string
    const category = formData.get('category') as string || 'uncategorized'

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const uploadPromises = files.map(async (file) => {
      // Create individual form data for each file
      const individualFormData = new FormData()
      individualFormData.append('file', file)
      individualFormData.append('folderId', folderId || '')
      individualFormData.append('category', category)

      // Create a new request for each file
      const individualRequest = new NextRequest(request.url, {
        method: 'POST',
        body: individualFormData,
        headers: request.headers,
      })

      return POST(individualRequest)
    })

    const results = await Promise.allSettled(uploadPromises)
    
    const successful = results
      .filter((result): result is PromiseFulfilledResult<Response> => result.status === 'fulfilled')
      .map(result => result.value)

    const failed = results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .map(result => result.reason)

    return NextResponse.json({
      success: true,
      uploaded: successful.length,
      failed: failed.length,
      results: successful.map(response => response.json()),
      errors: failed.map(error => error.message),
    })

  } catch (error) {
    console.error('Bulk upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}