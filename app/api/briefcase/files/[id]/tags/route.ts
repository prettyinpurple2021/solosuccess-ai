import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { createClient } from '@/lib/neon/server'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const { id } = params
    const documentId = id
    const { tag } = await request.json()

    if (!tag || typeof tag !== 'string' || !tag.trim()) {
      return NextResponse.json({ error: 'Tag is required' }, { status: 400 })
    }

    const client = await createClient()

    // Verify document ownership
    const { rows: [document] } = await client.query(`
      SELECT id, tags FROM documents 
      WHERE id = $1 AND user_id = $2
    `, [documentId, user.id])

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Parse existing tags
    const existingTags = document.tags ? JSON.parse(document.tags) : []
    const newTag = tag.trim().toLowerCase()

    // Check if tag already exists
    if (existingTags.includes(newTag)) {
      return NextResponse.json({ error: 'Tag already exists' }, { status: 400 })
    }

    // Add new tag
    const updatedTags = [...existingTags, newTag]

    // Update document
    const { rows: [_updatedDocument] } = await client.query(`
      UPDATE documents 
      SET tags = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [JSON.stringify(updatedTags), documentId])

    // Log activity
    await client.query(`
      INSERT INTO document_activity (document_id, user_id, action, details, created_at)
      VALUES ($1, $2, 'tag_added', $3, NOW())
    `, [
      documentId,
      user.id,
      JSON.stringify({
        tag: newTag,
        totalTags: updatedTags.length
      })
    ])

    return NextResponse.json({
      success: true,
      tags: updatedTags
    })

  } catch (error) {
    console.error('Add tag error:', error)
    return NextResponse.json({ 
      error: 'Failed to add tag' 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const { id } = params
    const documentId = id
    const { searchParams } = new URL(request.url)
    const tag = searchParams.get('tag')

    if (!tag) {
      return NextResponse.json({ error: 'Tag is required' }, { status: 400 })
    }

    const client = await createClient()

    // Verify document ownership
    const { rows: [document] } = await client.query(`
      SELECT id, tags FROM documents 
      WHERE id = $1 AND user_id = $2
    `, [documentId, user.id])

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Parse existing tags
    const existingTags = document.tags ? JSON.parse(document.tags) : []
    const tagToRemove = tag.trim().toLowerCase()

    // Check if tag exists
    if (!existingTags.includes(tagToRemove)) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    // Remove tag
    const updatedTags = existingTags.filter((t: string) => t !== tagToRemove)

    // Update document
    const { rows: [_updatedDocument] } = await client.query(`
      UPDATE documents 
      SET tags = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [JSON.stringify(updatedTags), documentId])

    // Log activity
    await client.query(`
      INSERT INTO document_activity (document_id, user_id, action, details, created_at)
      VALUES ($1, $2, 'tag_removed', $3, NOW())
    `, [
      documentId,
      user.id,
      JSON.stringify({
        tag: tagToRemove,
        totalTags: updatedTags.length
      })
    ])

    return NextResponse.json({
      success: true,
      tags: updatedTags
    })

  } catch (error) {
    console.error('Remove tag error:', error)
    return NextResponse.json({ 
      error: 'Failed to remove tag' 
    }, { status: 500 })
  }
}