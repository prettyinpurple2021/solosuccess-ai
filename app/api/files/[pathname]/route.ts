import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { logger, logError } from '@/lib/logger'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  return neon(url)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pathname: string }> }
) {
  try {
    const { pathname } = await params
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
    logError('Error serving file:', { error })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ pathname: string }> }
) {
  try {
    const { pathname } = await params
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
    logError('Error deleting file:', { error })
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
