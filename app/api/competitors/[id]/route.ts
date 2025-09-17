import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { neon } from '@neondatabase/serverless'

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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const competitorId = params.id
    const sql = getSql()

    // Get competitor profile
    const competitors = await sql`
      SELECT 
        cp.*,
        COUNT(DISTINCT cd.id) as intelligence_count,
        COUNT(DISTINCT ca.id) as alert_count
      FROM competitor_profiles cp
      LEFT JOIN intelligence_data cd ON cd.competitor_id = cp.id
      LEFT JOIN competitor_alerts ca ON ca.competitor_id = cp.id
      WHERE cp.id = ${competitorId} AND cp.user_id = ${user.id}
      GROUP BY cp.id
    `

    if (competitors.length === 0) {
      return NextResponse.json({ error: 'Competitor not found' }, { status: 404 })
    }

    const competitor = competitors[0]

    // Get key personnel (from intelligence data)
    const personnel = await sql`
      SELECT 
        id,
        extracted_data->'personnel' as personnel_data,
        collected_at
      FROM intelligence_data 
      WHERE competitor_id = ${competitorId} 
        AND data_type = 'company_info'
        AND extracted_data->'personnel' IS NOT NULL
      ORDER BY collected_at DESC
      LIMIT 1
    `

    // Get products (from intelligence data)
    const products = await sql`
      SELECT 
        id,
        extracted_data->'products' as products_data,
        collected_at
      FROM intelligence_data 
      WHERE competitor_id = ${competitorId} 
        AND data_type = 'products'
        AND extracted_data->'products' IS NOT NULL
      ORDER BY collected_at DESC
      LIMIT 1
    `

    // Format the response
    const competitorProfile = {
      id: competitor.id,
      name: competitor.name,
      domain: competitor.domain,
      description: competitor.description,
      industry: competitor.industry,
      headquarters: competitor.headquarters,
      foundedYear: competitor.founded_year,
      employeeCount: competitor.employee_count,
      fundingStage: competitor.funding_stage,
      fundingAmount: competitor.funding_amount,
      threatLevel: competitor.threat_level,
      monitoringStatus: competitor.monitoring_status,
      socialMediaHandles: competitor.social_media_handles || {},
      keyPersonnel: personnel.length > 0 ? 
        (personnel[0].personnel_data || []) : [],
      products: products.length > 0 ? 
        (products[0].products_data || []) : [],
      marketPosition: competitor.market_position || {},
      competitiveAdvantages: competitor.competitive_advantages || [],
      vulnerabilities: competitor.vulnerabilities || [],
      lastAnalyzed: competitor.last_analyzed,
      intelligenceCount: parseInt(competitor.intelligence_count) || 0,
      alertCount: parseInt(competitor.alert_count) || 0,
      createdAt: competitor.created_at,
      updatedAt: competitor.updated_at
    }

    return NextResponse.json(competitorProfile)
  } catch (error) {
    console.error('Error fetching competitor:', error)
    return NextResponse.json({ error: 'Failed to fetch competitor data' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const competitorId = params.id
    const updates = await request.json()
    const sql = getSql()

    // Update competitor profile
    const result = await sql`
      UPDATE competitor_profiles 
      SET 
        name = COALESCE(${updates.name}, name),
        domain = COALESCE(${updates.domain}, domain),
        description = COALESCE(${updates.description}, description),
        industry = COALESCE(${updates.industry}, industry),
        headquarters = COALESCE(${updates.headquarters}, headquarters),
        founded_year = COALESCE(${updates.foundedYear}, founded_year),
        employee_count = COALESCE(${updates.employeeCount}, employee_count),
        funding_stage = COALESCE(${updates.fundingStage}, funding_stage),
        funding_amount = COALESCE(${updates.fundingAmount}, funding_amount),
        threat_level = COALESCE(${updates.threatLevel}, threat_level),
        monitoring_status = COALESCE(${updates.monitoringStatus}, monitoring_status),
        social_media_handles = COALESCE(${updates.socialMediaHandles}, social_media_handles),
        market_position = COALESCE(${updates.marketPosition}, market_position),
        competitive_advantages = COALESCE(${updates.competitiveAdvantages}, competitive_advantages),
        vulnerabilities = COALESCE(${updates.vulnerabilities}, vulnerabilities),
        updated_at = NOW()
      WHERE id = ${competitorId} AND user_id = ${user.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Competitor not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      competitor: result[0] 
    })
  } catch (error) {
    console.error('Error updating competitor:', error)
    return NextResponse.json({ error: 'Failed to update competitor' }, { status: 500 })
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
    const competitorId = params.id
    const sql = getSql()

    // Delete competitor (cascade will handle related data)
    const result = await sql`
      DELETE FROM competitor_profiles 
      WHERE id = ${competitorId} AND user_id = ${user.id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Competitor not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Competitor deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting competitor:', error)
    return NextResponse.json({ error: 'Failed to delete competitor' }, { status: 500 })
  }
}