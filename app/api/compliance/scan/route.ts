import '@/lib/server-polyfills'
import { NextRequest, NextResponse} from 'next/server'
import { Pool} from 'pg'
import { analyze} from '@/lib/compliance-analyzer'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': 'SoloSuccess-GuardianAI/1.0' } })
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
  return await res.text()
}

export async function POST(req: NextRequest) {
  try {
    const { url, userId } = await req.json()
    if (!url || !userId) {
      return NextResponse.json({ error: 'url and userId are required' }, { status: 400 })
    }

    const html = await fetchHtml(url)
    const result = analyze(html)

    const client = await pool.connect()
    try {
      const scanInsert = `
        INSERT INTO compliance_scans (
          user_id, url, trust_score, page_title, has_privacy_policy, has_cookie_banner,
          has_contact_form, has_newsletter_signup, has_analytics, data_collection_points,
          cookie_types, consent_mechanisms
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        ) RETURNING id, scan_date
      `
      const scanRes = await client.query(scanInsert, [
        userId,
        url,
        result.trust_score,
        result.page_title,
        result.has_privacy_policy,
        result.has_cookie_banner,
        result.has_contact_form,
        result.has_newsletter_signup,
        result.has_analytics,
        result.data_collection_points,
        result.cookie_types,
        result.consent_mechanisms,
      ])

      // Record trust score history
      await client.query(
        `INSERT INTO trust_score_history (user_id, url, trust_score, score_change, scan_id)
         VALUES ($1, $2, $3, calculate_trust_score_change($1, $2, $3), $4)`,
        [userId, url, result.trust_score, scanRes.rows[0].id]
      )

      return NextResponse.json({
        id: scanRes.rows[0].id,
        scan_date: scanRes.rows[0].scan_date,
        url,
        trust_score: result.trust_score,
        details: result,
      })
    } finally {
      client.release()
    }
  } catch (err: unknown) {
    let message = 'Scan failed';
    if (err instanceof Error) {
      message = err.message;
    } else if (typeof err === 'string') {
      message = err;
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


