import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse} from 'next/server'
import { authenticateRequest} from '@/lib/auth-server'
import { createClient} from '@/lib/neon/server'



// Removed Edge Runtime due to Node.js dependencies (JWT, auth, fs, crypto, etc.)
// Edge Runtime disabled due to Node.js dependency incompatibility

export async function POST(
  request: NextRequest
) {
  try {
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, fileIds, options } = await request.json()

    if (!action || !fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json({ error: 'Action and file IDs are required' }, { status: 400 })
    }

    const client = await createClient()

    // Verify all files belong to the user
    const { rows: userFiles } = await client.query(`
      SELECT id FROM documents 
      WHERE id = ANY($1) AND user_id = $2
    `, [fileIds, user.id])

    if (userFiles.length !== fileIds.length) {
      return NextResponse.json({ error: 'Some files not found or access denied' }, { status: 403 })
    }

    let result: any = { success: true, processed: 0, failed: 0, errors: [] }

    switch (action) {
      case 'delete':
        result = await handleBulkDelete(client, fileIds, user.id)
        break
      case 'move':
        if (!options?.folderId) {
          return NextResponse.json({ error: 'Folder ID is required for move operation' }, { status: 400 })
        }
        result = await handleBulkMove(client, fileIds, options.folderId, user.id)
        break
      case 'copy':
        if (!options?.folderId) {
          return NextResponse.json({ error: 'Folder ID is required for copy operation' }, { status: 400 })
        }
        result = await handleBulkCopy(client, fileIds, options.folderId, user.id)
        break
      case 'tag':
        if (!options?.tags || !Array.isArray(options.tags)) {
          return NextResponse.json({ error: 'Tags array is required for tag operation' }, { status: 400 })
        }
        result = await handleBulkTag(client, fileIds, options.tags, options?.operation || 'add', user.id)
        break
      case 'category':
        if (!options?.category) {
          return NextResponse.json({ error: 'Category is required for category operation' }, { status: 400 })
        }
        result = await handleBulkCategory(client, fileIds, options.category, user.id)
        break
      case 'favorite':
        result = await handleBulkFavorite(client, fileIds, options?.favorite !== false, user.id)
        break
      case 'download':
        result = await handleBulkDownload(client, fileIds, user.id)
        break
      case 'share':
        if (!options?.permissions) {
          return NextResponse.json({ error: 'Permissions are required for share operation' }, { status: 400 })
        }
        result = await handleBulkShare(client, fileIds, options.permissions, user.id)
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json(result)

  } catch (error) {
    logError('Bulk operation error:', error)
    return NextResponse.json({ 
      error: 'Failed to perform bulk operation' 
    }, { status: 500 })
  }
}

async function handleBulkDelete(client: any, fileIds: string[], userId: string) {
  const result = { success: true, processed: 0, failed: 0, errors: [] as string[] }

  for (const fileId of fileIds) {
    try {
      // Delete document versions first
      await client.query(`
        DELETE FROM document_versions WHERE document_id = $1
      `, [fileId])

      // Delete document permissions
      await client.query(`
        DELETE FROM document_permissions WHERE document_id = $1
      `, [fileId])

      // Delete share links
      await client.query(`
        DELETE FROM document_share_links WHERE document_id = $1
      `, [fileId])

      // Delete activity logs
      await client.query(`
        DELETE FROM document_activity WHERE document_id = $1
      `, [fileId])

      // Delete the document
      await client.query(`
        DELETE FROM documents WHERE id = $1 AND user_id = $2
      `, [fileId, userId])

      result.processed++
    } catch (error) {
      result.failed++
      result.errors.push(`Failed to delete file ${fileId}: ${error}`)
    }
  }

  return result
}

async function handleBulkMove(client: any, fileIds: string[], folderId: string, userId: string) {
  const result = { success: true, processed: 0, failed: 0, errors: [] as string[] }

  // Verify folder exists and belongs to user
  const { rows: [folder] } = await client.query(`
    SELECT id FROM document_folders WHERE id = $1 AND user_id = $2
  `, [folderId, userId])

  if (!folder) {
    return { success: false, processed: 0, failed: fileIds.length, errors: ['Folder not found'] }
  }

  for (const fileId of fileIds) {
    try {
      await client.query(`
        UPDATE documents 
        SET folder_id = $1, updated_at = NOW()
        WHERE id = $2 AND user_id = $3
      `, [folderId, fileId, userId])

      // Log activity
      await client.query(`
        INSERT INTO document_activity (document_id, user_id, action, details, created_at)
        VALUES ($1, $2, 'moved', $3, NOW())
      `, [fileId, userId, JSON.stringify({ folderId })])

      result.processed++
    } catch (error) {
      result.failed++
      result.errors.push(`Failed to move file ${fileId}: ${error}`)
    }
  }

  return result
}

async function handleBulkCopy(client: any, fileIds: string[], folderId: string, userId: string) {
  const result = { success: true, processed: 0, failed: 0, errors: [] as string[], copiedFiles: [] as string[] }

  // Verify folder exists and belongs to user
  const { rows: [folder] } = await client.query(`
    SELECT id FROM document_folders WHERE id = $1 AND user_id = $2
  `, [folderId, userId])

  if (!folder) {
    return { success: false, processed: 0, failed: fileIds.length, errors: ['Folder not found'] }
  }

  for (const fileId of fileIds) {
    try {
      // Get original file data
      const { rows: [originalFile] } = await client.query(`
        SELECT * FROM documents WHERE id = $1 AND user_id = $2
      `, [fileId, userId])

      if (!originalFile) {
        result.failed++
        result.errors.push(`Original file ${fileId} not found`)
        continue
      }

      // Create copy with new name
      const copyName = `${originalFile.name} (Copy)`
      const { rows: [copiedFile] } = await client.query(`
        INSERT INTO documents (
          user_id, name, original_name, file_type, mime_type, size, file_data,
          category, tags, description, folder_id, is_favorite, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
        RETURNING id
      `, [
        userId,
        copyName,
        originalFile.original_name,
        originalFile.file_type,
        originalFile.mime_type,
        originalFile.size,
        originalFile.file_data,
        originalFile.category,
        originalFile.tags,
        originalFile.description,
        folderId,
        false // Don't copy favorite status
      ])

      // Log activity
      await client.query(`
        INSERT INTO document_activity (document_id, user_id, action, details, created_at)
        VALUES ($1, $2, 'copied', $3, NOW())
      `, [copiedFile.id, userId, JSON.stringify({ originalFileId: fileId, folderId })])

      result.processed++
      result.copiedFiles.push(copiedFile.id)
    } catch (error) {
      result.failed++
      result.errors.push(`Failed to copy file ${fileId}: ${error}`)
    }
  }

  return result
}

async function handleBulkTag(client: any, fileIds: string[], tags: string[], operation: 'add' | 'remove', userId: string) {
  const result = { success: true, processed: 0, failed: 0, errors: [] as string[] }

  for (const fileId of fileIds) {
    try {
      // Get current tags
      const { rows: [file] } = await client.query(`
        SELECT tags FROM documents WHERE id = $1 AND user_id = $2
      `, [fileId, userId])

      if (!file) {
        result.failed++
        result.errors.push(`File ${fileId} not found`)
        continue
      }

      const currentTags = file.tags ? JSON.parse(file.tags) : []
      let newTags: string[]

      if (operation === 'add') {
        newTags = [...new Set([...currentTags, ...tags.map(t => t.toLowerCase().trim())])]
      } else {
        newTags = currentTags.filter((tag: string) => !tags.includes(tag.toLowerCase().trim()))
      }

      await client.query(`
        UPDATE documents 
        SET tags = $1, updated_at = NOW()
        WHERE id = $2 AND user_id = $3
      `, [JSON.stringify(newTags), fileId, userId])

      // Log activity
      await client.query(`
        INSERT INTO document_activity (document_id, user_id, action, details, created_at)
        VALUES ($1, $2, 'tags_updated', $3, NOW())
      `, [fileId, userId, JSON.stringify({ operation, tags, newTags })])

      result.processed++
    } catch (error) {
      result.failed++
      result.errors.push(`Failed to update tags for file ${fileId}: ${error}`)
    }
  }

  return result
}

async function handleBulkCategory(client: any, fileIds: string[], category: string, userId: string) {
  const result = { success: true, processed: 0, failed: 0, errors: [] as string[] }

  for (const fileId of fileIds) {
    try {
      await client.query(`
        UPDATE documents 
        SET category = $1, updated_at = NOW()
        WHERE id = $2 AND user_id = $3
      `, [category, fileId, userId])

      // Log activity
      await client.query(`
        INSERT INTO document_activity (document_id, user_id, action, details, created_at)
        VALUES ($1, $2, 'category_updated', $3, NOW())
      `, [fileId, userId, JSON.stringify({ category })])

      result.processed++
    } catch (error) {
      result.failed++
      result.errors.push(`Failed to update category for file ${fileId}: ${error}`)
    }
  }

  return result
}

async function handleBulkFavorite(client: any, fileIds: string[], favorite: boolean, userId: string) {
  const result = { success: true, processed: 0, failed: 0, errors: [] as string[] }

  for (const fileId of fileIds) {
    try {
      await client.query(`
        UPDATE documents 
        SET is_favorite = $1, updated_at = NOW()
        WHERE id = $2 AND user_id = $3
      `, [favorite, fileId, userId])

      // Log activity
      await client.query(`
        INSERT INTO document_activity (document_id, user_id, action, details, created_at)
        VALUES ($1, $2, $3, $4, NOW())
      `, [fileId, userId, favorite ? 'favorited' : 'unfavorited', JSON.stringify({ isFavorite: favorite })])

      result.processed++
    } catch (error) {
      result.failed++
      result.errors.push(`Failed to update favorite status for file ${fileId}: ${error}`)
    }
  }

  return result
}

async function handleBulkDownload(client: any, fileIds: string[], userId: string) {
  const result = { success: true, processed: 0, failed: 0, errors: [] as string[], downloadUrls: [] as string[] }

  for (const fileId of fileIds) {
    try {
      // Update download count
      await client.query(`
        UPDATE documents 
        SET download_count = download_count + 1, last_accessed = NOW(), updated_at = NOW()
        WHERE id = $1 AND user_id = $2
      `, [fileId, userId])

      // Log activity
      await client.query(`
        INSERT INTO document_activity (document_id, user_id, action, details, created_at)
        VALUES ($1, $2, 'downloaded', $3, NOW())
      `, [fileId, userId, JSON.stringify({ bulkDownload: true })])

      result.processed++
      result.downloadUrls.push(`/api/briefcase/files/${fileId}/download`)
    } catch (error) {
      result.failed++
      result.errors.push(`Failed to prepare download for file ${fileId}: ${error}`)
    }
  }

  return result
}

async function handleBulkShare(client: any, fileIds: string[], permissions: any, _userId: string) {
  const result = { success: true, processed: 0, failed: 0, errors: [] as string[], shareLinks: [] as string[] }

  for (const fileId of fileIds) {
    try {
      // Create share link for each file
      const shareResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/briefcase/files/${fileId}/share-links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permissions)
      })

      if (shareResponse.ok) {
        const shareData = await shareResponse.json()
        result.shareLinks.push(shareData.url)
        result.processed++
      } else {
        result.failed++
        result.errors.push(`Failed to create share link for file ${fileId}`)
      }
    } catch (error) {
      result.failed++
      result.errors.push(`Failed to share file ${fileId}: ${error}`)
    }
  }

  return result
}
