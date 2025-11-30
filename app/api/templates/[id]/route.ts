import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { templates } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { verifyAuth } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(req)
    if (!authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = authResult.user.id
    const { id } = await params
    const templateId = parseInt(id)

    if (isNaN(templateId)) {
      return NextResponse.json({ error: 'Invalid template ID' }, { status: 400 })
    }

    const updates = await req.json()

    // Verify ownership
    const existingTemplate = await db
      .select()
      .from(templates)
      .where(and(eq(templates.id, templateId), eq(templates.user_id, userId)))
      .limit(1)

    if (existingTemplate.length === 0) {
      return NextResponse.json({ error: 'Template not found or unauthorized' }, { status: 404 })
    }

    const updatedTemplate = await db
      .update(templates)
      .set({
        ...updates,
        updated_at: new Date()
      })
      .where(eq(templates.id, templateId))
      .returning()

    return NextResponse.json(updatedTemplate[0])
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(req)
    if (!authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = authResult.user.id
    const { id } = await params
    const templateId = parseInt(id)

    if (isNaN(templateId)) {
      return NextResponse.json({ error: 'Invalid template ID' }, { status: 400 })
    }

    // Verify ownership
    const existingTemplate = await db
      .select()
      .from(templates)
      .where(and(eq(templates.id, templateId), eq(templates.user_id, userId)))
      .limit(1)

    if (existingTemplate.length === 0) {
      return NextResponse.json({ error: 'Template not found or unauthorized' }, { status: 404 })
    }

    await db.delete(templates).where(eq(templates.id, templateId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
