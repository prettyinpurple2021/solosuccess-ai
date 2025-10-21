import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextResponse} from 'next/server'
import { authenticateRequest} from '@/lib/auth-server'
import { getDb} from '@/lib/database-client'
import { z} from 'zod'
import { rateLimitByIp} from '@/lib/rate-limit'
import { getIdempotencyKeyFromRequest, reserveIdempotencyKey} from '@/lib/idempotency'
import { sql} from 'drizzle-orm'

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'


// DELETE /api/templates/:id → delete a saved user template
const IdParamSchema = z.object({ id: z.string().regex(/^\d+$/) })


export async function DELETE(
  _request: Request,
  context: unknown
) {
  try {
    const req = _request as Request
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const { allowed } = rateLimitByIp('templates:delete', ip, 60_000, 60)
    if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    const parsed = IdParamSchema.safeParse({ id: (context as { params?: { id?: string } })?.params?.id })
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }
    const { id } = parsed.data
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDb()

    const key = getIdempotencyKeyFromRequest(req)
    if (key) {
      const reserved = await reserveIdempotencyKey(db, `tpl-del:${id}:${user.id}:${key}`)
      if (!reserved) {
        return NextResponse.json({ error: 'Duplicate request' }, { status: 409 })
      }
    }
    const result = await db.execute(sql`
      DELETE FROM user_templates WHERE id = ${id} AND user_id = ${user.id}
    `)

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    logError('Delete template error:', error)
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
  }
}


