import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/neon/server'
import { authenticateRequest } from '@/lib/auth-server'
import { neon } from '@neondatabase/serverless'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  return neon(url)
}

// Unified route that handles both ID-based and pathname-based file serving
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ param: string }> }
) {
  try {
    const params = await context.params
    const param = params.param
    
    if (!param) return new NextResponse('Not found', { status: 404 })

    // Check if param is a UUID (ID-based) or a pathname
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param)
    
    if (isUuid) {
      // Handle ID-based file serving (documents table)
      return await handleIdBasedFile(param)
    } else {
      // Handle pathname-based file serving (file_storage table)
      return await handlePathnameBasedFile(param)
    }
  } catch (error) {
    logError('Error serving file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// Handle ID-based file serving from documents table
async function handleIdBasedFile(id: string) {
  try {
    const client = await createClient()
    const { rows } = await client.query(
      'SELECT id, content_type, content, filename FROM documents WHERE id = $1',
      [id]
    )

    if (rows.length === 0) {
      return new NextResponse('Not found', { status: 404 })
    }

    const file = rows[0] as {
      id: string
      content_type: string
      content: string
      filename: string
    }

    const buffer = Buffer.from(file.content, 'base64')
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': file.content_type,
        'Content-Disposition': `inline; filename="${file.filename}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    logError('Error serving ID-based file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// Handle pathname-based file serving from file_storage table
async function handlePathnameBasedFile(pathname: string) {
  try {
    const decodedPathname = decodeURIComponent(pathname)
    const sql = getSql()
    
    // Fetch file from database
    const result = await sql`
      SELECT filename, content_type, file_size, file_data
      FROM file_storage
      WHERE pathname = ${decodedPathname}
    `
    
    if (result.length === 0) {
      return new NextResponse('File not found', { status: 404 })
    }
    
    const file = result[0]
    
    // Convert buffer back to response
    const buffer = Buffer.from(file.file_data)
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': file.content_type,
        'Content-Length': file.file_size.toString(),
        'Content-Disposition': `attachment; filename="${file.filename}"`,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    })
  } catch (error) {
    logError('Error serving pathname-based file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// DELETE endpoint - handles both ID-based and pathname-based deletion
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ param: string }> }
) {
  try {
    const params = await context.params
    const param = params.param
    
    if (!param) return new NextResponse('Not found', { status: 404 })

    // Check if param is a UUID (ID-based) or a pathname
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param)
    
    if (isUuid) {
      // Handle ID-based file deletion (documents table)
      return await handleIdBasedFileDeletion(param)
    } else {
      // Handle pathname-based file deletion (file_storage table)
      return await handlePathnameBasedFileDeletion(param)
    }
  } catch (error) {
    logError('Error deleting file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// Handle ID-based file deletion from documents table
async function handleIdBasedFileDeletion(id: string) {
  try {
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await createClient()
    const { rowCount } = await client.query(
      'DELETE FROM documents WHERE id = $1 AND user_id = $2',
      [id, user.id]
    )

    if (rowCount === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    logError('Error deleting ID-based file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}

// Handle pathname-based file deletion from file_storage table
async function handlePathnameBasedFileDeletion(pathname: string) {
  try {
    const decodedPathname = decodeURIComponent(pathname)
    const sql = getSql()
    
    // Delete file from database
    const result = await sql`
      DELETE FROM file_storage
      WHERE pathname = ${decodedPathname}
      RETURNING filename
    `
    
    if (result.length === 0) {
      return new NextResponse('File not found', { status: 404 })
    }
    
    return NextResponse.json({ 
      message: 'File deleted successfully',
      filename: result[0].filename
    })
  } catch (error) {
    logError('Error deleting pathname-based file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
