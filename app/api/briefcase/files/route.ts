import { NextRequest, NextResponse } from 'next/server'
import { MOCK_FILES } from './mock-files'


export async function GET(_request: Request) {
  try {
    return NextResponse.json({
      success: true,
      files: MOCK_FILES
    })
  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch files'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Placeholder for demo - in production this would create a new file record
    const newFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: body.name || 'Untitled Document',
      file_type: body.file_type || 'txt',
      mime_type: body.mime_type || 'text/plain',
      size: body.size || 0,
      upload_date: new Date().toISOString(),
      last_modified: new Date().toISOString(),
      category: body.category || 'document',
      tags: Array.isArray(body.tags) ? body.tags : [],
      description: body.description || '',
      is_favorite: false,
      folder_id: body.folder_id || null,
      storage_path: `/files/${body.name || 'untitled'}`
    }

    return NextResponse.json({
      success: true,
      file: newFile,
      message: 'File created successfully'
    })
  } catch (error) {
    console.error('Error creating file:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create file'
    }, { status: 500 })
  }
}
