import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { createClient } from '@/lib/neon/server'

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await createClient()

    // Get all folders for user
    const { rows: folders } = await client.query(`
      SELECT 
        id, name, description, color, icon, is_default, 
        file_count, total_size, created_at, updated_at,
        parent_id
      FROM document_folders 
      WHERE user_id = $1 
      ORDER BY is_default DESC, name ASC
    `, [user.id])

    // Organize folders into tree structure
    const folderMap = new Map()
    const rootFolders: any[] = []

    // First pass: create folder objects
    folders.forEach(folder => {
      folderMap.set(folder.id, {
        ...folder,
        children: []
      })
    })

    // Second pass: build tree structure
    folders.forEach(folder => {
      const folderObj = folderMap.get(folder.id)
      if (folder.parent_id) {
        const parent = folderMap.get(folder.parent_id)
        if (parent) {
          parent.children.push(folderObj)
        }
      } else {
        rootFolders.push(folderObj)
      }
    })

    return NextResponse.json({
      success: true,
      folders: rootFolders,
      totalFolders: folders.length
    })

  } catch (error) {
    console.error('Get folders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch folders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, color, icon, parentId } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 })
    }

    const client = await createClient()

    // Check if folder name already exists in the same parent
    const { rows: existingFolders } = await client.query(`
      SELECT id FROM document_folders 
      WHERE user_id = $1 AND name = $2 AND (parent_id = $3 OR (parent_id IS NULL AND $3 IS NULL))
    `, [user.id, name.trim(), parentId || null])

    if (existingFolders.length > 0) {
      return NextResponse.json({ 
        error: 'Folder with this name already exists in the same location' 
      }, { status: 400 })
    }

    // Create folder
    const { rows: [folder] } = await client.query(`
      INSERT INTO document_folders (
        user_id, name, description, color, icon, parent_id, 
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `, [
      user.id,
      name.trim(),
      description || null,
      color || '#8B5CF6',
      icon || null,
      parentId || null
    ])

    return NextResponse.json({
      success: true,
      folder: {
        id: folder.id,
        name: folder.name,
        description: folder.description,
        color: folder.color,
        icon: folder.icon,
        parentId: folder.parent_id,
        fileCount: folder.file_count,
        totalSize: folder.total_size,
        createdAt: folder.created_at,
        updatedAt: folder.updated_at,
      }
    })

  } catch (error) {
    console.error('Create folder error:', error)
    return NextResponse.json(
      { error: 'Failed to create folder' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, description, color, icon, parentId } = body

    if (!id) {
      return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 })
    }

    const client = await createClient()

    // Check if folder exists and user owns it
    const { rows: [existingFolder] } = await client.query(`
      SELECT id FROM document_folders 
      WHERE id = $1 AND user_id = $2
    `, [id, user.id])

    if (!existingFolder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    // Check if new name conflicts with existing folders
    if (name && name.trim().length > 0) {
      const { rows: conflictingFolders } = await client.query(`
        SELECT id FROM document_folders 
        WHERE user_id = $1 AND name = $2 AND id != $3 AND (parent_id = $4 OR (parent_id IS NULL AND $4 IS NULL))
      `, [user.id, name.trim(), id, parentId || null])

      if (conflictingFolders.length > 0) {
        return NextResponse.json({ 
          error: 'Folder with this name already exists in the same location' 
        }, { status: 400 })
      }
    }

    // Update folder
    const { rows: [updatedFolder] } = await client.query(`
      UPDATE document_folders 
      SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        color = COALESCE($3, color),
        icon = COALESCE($4, icon),
        parent_id = COALESCE($5, parent_id),
        updated_at = NOW()
      WHERE id = $6 AND user_id = $7
      RETURNING *
    `, [
      name ? name.trim() : null,
      description,
      color,
      icon,
      parentId,
      id,
      user.id
    ])

    return NextResponse.json({
      success: true,
      folder: {
        id: updatedFolder.id,
        name: updatedFolder.name,
        description: updatedFolder.description,
        color: updatedFolder.color,
        icon: updatedFolder.icon,
        parentId: updatedFolder.parent_id,
        fileCount: updatedFolder.file_count,
        totalSize: updatedFolder.total_size,
        createdAt: updatedFolder.created_at,
        updatedAt: updatedFolder.updated_at,
      }
    })

  } catch (error) {
    console.error('Update folder error:', error)
    return NextResponse.json(
      { error: 'Failed to update folder' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const folderId = searchParams.get('id')

    if (!folderId) {
      return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 })
    }

    const client = await createClient()

    // Check if folder exists and user owns it
    const { rows: [folder] } = await client.query(`
      SELECT id, file_count FROM document_folders 
      WHERE id = $1 AND user_id = $2
    `, [folderId, user.id])

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    // Check if folder has files
    if (folder.file_count > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete folder with files. Please move or delete files first.' 
      }, { status: 400 })
    }

    // Check if folder has subfolders
    const { rows: subfolders } = await client.query(`
      SELECT id FROM document_folders 
      WHERE parent_id = $1 AND user_id = $2
    `, [folderId, user.id])

    if (subfolders.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete folder with subfolders. Please delete subfolders first.' 
      }, { status: 400 })
    }

    // Delete folder
    await client.query(`
      DELETE FROM document_folders 
      WHERE id = $1 AND user_id = $2
    `, [folderId, user.id])

    return NextResponse.json({
      success: true,
      message: 'Folder deleted successfully'
    })

  } catch (error) {
    console.error('Delete folder error:', error)
    return NextResponse.json(
      { error: 'Failed to delete folder' },
      { status: 500 }
    )
  }
}