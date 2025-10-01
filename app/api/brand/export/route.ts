import { logger, logError, logInfo } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { rateLimitByIp } from '@/lib/rate-limit'
import { z } from 'zod'


// Removed Edge Runtime due to Node.js dependencies (JWT, auth, fs, crypto, etc.)
// Edge Runtime disabled due to Node.js dependency incompatibility

export const dynamic = 'force-dynamic'

const exportSchema = z.object({
  format: z.enum(['pdf', 'json', 'zip']),
  includeAssets: z.boolean().optional().default(true),
  includeGuidelines: z.boolean().optional().default(true),
})

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.user) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const rateLimitResult = await rateLimitByIp(request, { requests: 5, window: 60 })
    if (!rateLimitResult.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await request.json()
    const { format, includeAssets, includeGuidelines } = exportSchema.parse(body)

    // Generate brand export
    const exportData = await generateBrandExport(authResult.user.id, format, includeAssets, includeGuidelines)

    logInfo('Brand export generated successfully', { userId: authResult.user.id, format })
    return NextResponse.json({ 
      success: true, 
      exportData,
      downloadUrl: `/api/brand/export/download/${exportData.id}`
    })
  } catch (error) {
    logError('Error generating brand export:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid export parameters', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateBrandExport(userId: string, format: string, includeAssets: boolean, includeGuidelines: boolean) {
  try {
    // Mock export generation - in production, this would generate actual files
    const exportId = `brand-export-${userId}-${Date.now()}`
    
    const exportData = {
      id: exportId,
      userId,
      format,
      includeAssets,
      includeGuidelines,
      generatedAt: new Date().toISOString(),
      status: 'completed',
      fileSize: format === 'pdf' ? '2.3 MB' : format === 'zip' ? '15.7 MB' : '156 KB',
      contents: {
        brandOverview: {
          companyName: 'Your Company Name',
          tagline: 'Your Brand Tagline',
          description: 'Your brand description',
          industry: 'Your Industry'
        },
        visualIdentity: {
          logo: includeAssets ? ['logo-primary.png', 'logo-secondary.png', 'logo-monochrome.png'] : [],
          colorPalette: {
            primary: '#B621FF',
            secondary: '#18FFFF',
            accent: '#FF1FAF',
            neutral: '#F5F5F5'
          },
          typography: {
            primary: 'Inter',
            secondary: 'Roboto'
          }
        },
        brandGuidelines: includeGuidelines ? {
          logoUsage: [
            'Always maintain a minimum clear space around the logo',
            'Never alter, distort, or recreate the logo',
            'Use high-resolution versions for print materials'
          ],
          colorUsage: [
            'Use primary color for main elements',
            'Use secondary color for accents',
            'Ensure sufficient contrast ratios'
          ],
          typographyRules: [
            'Use primary font for headings',
            'Use secondary font for body text',
            'Maintain consistent font sizes'
          ]
        } : null,
        marketingAssets: includeAssets ? {
          businessCards: ['business-card-front.pdf', 'business-card-back.pdf'],
          letterheads: ['letterhead-template.pdf'],
          socialMedia: ['social-media-templates.zip'],
          presentations: ['presentation-template.pptx']
        } : null
      }
    }

    // In production, this would:
    // 1. Fetch user's brand data from database
    // 2. Generate actual PDF/JSON/ZIP files
    // 3. Upload to cloud storage
    // 4. Return download URL

    return exportData
  } catch (error) {
    logError('Error in brand export generation:', error)
    throw error
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.user) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    // Get user's export history
    const exports = await getUserExportHistory(authResult.user.id)

    return NextResponse.json({ 
      success: true, 
      exports 
    })
  } catch (error) {
    logError('Error fetching export history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getUserExportHistory(userId: string) {
  try {
    // Mock export history - in production, this would fetch from database
    return [
      {
        id: `export-${userId}-1`,
        format: 'pdf',
        generatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        fileSize: '2.3 MB',
        status: 'completed',
        downloadUrl: `/api/brand/export/download/export-${userId}-1`
      },
      {
        id: `export-${userId}-2`,
        format: 'zip',
        generatedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        fileSize: '15.7 MB',
        status: 'completed',
        downloadUrl: `/api/brand/export/download/export-${userId}-2`
      }
    ]
  } catch (error) {
    logError('Error fetching user export history:', error)
    throw error
  }
}