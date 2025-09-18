import { NextRequest, NextResponse} from 'next/server'
import { authenticateRequest} from '@/lib/auth-server'
import { rateLimitByIp} from '@/lib/rate-limit'
import { z} from 'zod'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Helper function to generate logo with OpenAI DALL-E
async function generateLogoWithOpenAI(client: any, brandName: string, style: string, description: string) {
  const prompt = `Create a professional logo for "${brandName}" in ${style} style. ${description}. The logo should be simple, memorable, and suitable for business use. Use clean lines and modern design principles. The logo should work well in both color and black & white.`
  
  const response = await client.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
    quality: "standard",
    style: "natural"
  })

  return {
    url: response.data[0].url
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { allowed } = rateLimitByIp('brand:generate-logo', ip, 30_000, 20)
    if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const BodySchema = z.object({
      brandName: z.string().min(1, 'Brand name is required'),
      style: z.string().optional(),
    })
    const parsed = BodySchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
    }
    const { brandName, style } = parsed.data

    // Generate real logos using OpenAI DALL-E if API key is available
    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = require('openai')
import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
        const client = new openai.OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        })

        // Generate multiple logo variations
        const logoPromises = [
          generateLogoWithOpenAI(client, brandName, style || 'modern', 'clean and professional'),
          generateLogoWithOpenAI(client, brandName, style || 'elegant', 'sophisticated and refined'),
          generateLogoWithOpenAI(client, brandName, style || 'bold', 'dynamic and impactful')
        ]

        const logoResults = await Promise.allSettled(logoPromises)
        
        const logos = logoResults
          .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
          .map((result, index) => ({
            id: index + 1,
            url: result.value.url,
            style: [style || 'modern', style || 'elegant', style || 'bold'][index],
            description: ['Modern logo design', 'Elegant logo design', 'Bold logo design'][index],
            generated: true
          }))

        if (logos.length > 0) {
          return NextResponse.json({ 
            logos,
            isFallback: false,
            generatedBy: 'OpenAI DALL-E'
          }, { status: 200 })
        }
      } catch (aiError) {
        logError('OpenAI logo generation failed:', aiError)
        // Fall through to fallback
      }
    }

    // Fallback to mock data if AI service fails or is not available
    const mockLogos = [
      {
        id: 1,
        url: 'https://via.placeholder.com/300x100/8E24AA/FFFFFF?text=' + encodeURIComponent(brandName),
        style: style || 'modern',
        description: 'Modern logo design'
      },
      {
        id: 2,
        url: 'https://via.placeholder.com/300x100/E1BEE7/000000?text=' + encodeURIComponent(brandName),
        style: style || 'elegant',
        description: 'Elegant logo design'
      },
      {
        id: 3,
        url: 'https://via.placeholder.com/300x100/FF4081/FFFFFF?text=' + encodeURIComponent(brandName),
        style: style || 'bold',
        description: 'Bold logo design'
      }
    ]

    return NextResponse.json({ 
      logos: mockLogos,
      isFallback: true,
      fallbackReason: process.env.OPENAI_API_KEY ? 'AI service temporarily unavailable' : 'OpenAI API key not configured'
    }, { status: 200 })
  } catch (error) {
    logError('Error generating logos:', error)
    return NextResponse.json(
      { error: 'Failed to generate logos' },
      { status: 500 }
    )
  }
}
