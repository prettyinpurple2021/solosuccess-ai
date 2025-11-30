
import { NextRequest, NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { templates } from '@/db/schema'
import * as jose from 'jose'

export const dynamic = 'force-dynamic'

async function getUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.substring(7)
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { title, description, content, category } = body

    const sql = getSql()

    // Verify ownership
    const existing = await sql`
      SELECT * FROM templates WHERE id = ${id} AND user_id = ${user.userId as string}
    `

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Template not found or unauthorized' }, { status: 404 })
    }

    const updatedTemplate = await sql`
      UPDATE templates 
      SET title = ${title}, description = ${description}, content = ${content}, category = ${category}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(updatedTemplate[0])
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const sql = getSql()

    // Verify ownership
    const existing = await sql`
      SELECT * FROM templates WHERE id = ${id} AND user_id = ${user.userId as string}
    `

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Template not found or unauthorized' }, { status: 404 })
    }

    await sql`
      DELETE FROM templates WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
