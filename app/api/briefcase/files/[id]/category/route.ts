import { NextRequest, NextResponse} from 'next/server'
import { authenticateRequest} from '@/lib/auth-server'
import { createClient} from '@/lib/neon/server'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params
    
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { category } = await request.json()
    const documentId = id

    if (!category || typeof category !== 'string') {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    const client = await createClient()

    // Verify document ownership
    const { rows: [document] } = await client.query(`
      SELECT id, category FROM documents 
      WHERE id = $1 AND user_id = $2
    `, [documentId, user.id])

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Update category
    await client.query(`
      UPDATE documents 
      SET category = $1, updated_at = NOW()
      WHERE id = $2
    `, [category, documentId])

    // Log activity
    await client.query(`
      INSERT INTO document_activity (document_id, user_id, action, details, created_at)
      VALUES ($1, $2, 'category_updated', $3, NOW())
    `, [
      documentId,
      user.id,
      JSON.stringify({
        newCategory: category,
        previousCategory: document.category
      })
    ])

    return NextResponse.json({
      success: true,
      category,
      message: 'Category updated successfully'
    })

  } catch (error) {
    console.error('Update category error:', error)
    return NextResponse.json({ 
      error: 'Failed to update category' 
    }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params
    
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documentId = id
    const client = await createClient()

    // Get document category
    const { rows: [document] } = await client.query(`
      SELECT id, category FROM documents 
      WHERE id = $1 AND user_id = $2
    `, [documentId, user.id])

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json({
      category: document.category
    })

  } catch (error) {
    console.error('Get category error:', error)
    return NextResponse.json({ 
      error: 'Failed to get category' 
    }, { status: 500 })
  }
}
