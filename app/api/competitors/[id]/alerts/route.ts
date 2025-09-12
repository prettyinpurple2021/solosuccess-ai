import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth-server';
import { rateLimitByIp } from '@/lib/rate-limit';
import { alertSystem } from '@/lib/competitor-alert-system';
import { z } from 'zod';

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const getCompetitorAlertsSchema = z.object({
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { allowed } = rateLimitByIp('competitor-alerts', ip, 60000, 100);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Authentication
    const { user, error } = await authenticateRequest();
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const competitorId = parseInt(id);
    if (isNaN(competitorId)) {
      return NextResponse.json(
        { error: 'Invalid competitor ID' },
        { status: 400 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const { limit } = getCompetitorAlertsSchema.parse(Object.fromEntries(searchParams));

    // Get alerts for specific competitor
    const alerts = await alertSystem.getAlertsByCompetitor(
      user.id,
      competitorId,
      limit
    );

    return NextResponse.json({
      alerts,
      competitor_id: competitorId,
      pagination: {
        limit,
        total: alerts.length,
      },
    });

  } catch (error) {
    console.error('Error fetching competitor alerts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}