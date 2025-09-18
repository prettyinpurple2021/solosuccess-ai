import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { rateLimitByIp } from '@/lib/rate-limit'
import { z } from 'zod'
import OpenAI from 'openai'
import { logError, logInfo } from '@/lib/logger'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Initialize OpenAI client
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }
  return new OpenAI({ apiKey })
}

// Validation schemas for different template types
const SalesScriptSchema = z.object({
  type: z.literal('sales-script'),
  persona: z.string().min(1, 'Target persona is required'),
  offerDetails: z.string().min(1, 'Offer details are required'),
  platform: z.enum(['linkedin', 'instagram', 'twitter', 'facebook', 'email', 'dm']),
  tone: z.enum(['professional', 'casual', 'friendly', 'authoritative', 'conversational']),
  industry: z.string().optional(),
  painPoints: z.array(z.string()).optional(),
})

const OfferNamingSchema = z.object({
  type: z.literal('offer-naming'),
  productDescription: z.string().min(1, 'Product description is required'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  pricePoint: z.enum(['budget', 'mid-range', 'premium', 'luxury']).optional(),
  industry: z.string().optional(),
  keyBenefits: z.array(z.string()).optional(),
  tone: z.enum(['professional', 'playful', 'serious', 'aspirational']).optional(),
})

const EmailCampaignSchema = z.object({
  type: z.literal('email-campaign'),
  campaignGoal: z.string().min(1, 'Campaign goal is required'),
  targetAudience: z.string().min(1, 'Target audience is required'),
  productService: z.string().min(1, 'Product/service description is required'),
  tone: z.enum(['professional', 'casual', 'friendly', 'persuasive', 'informative']),
  emailCount: z.number().min(1).max(10).default(3),
  callToAction: z.string().optional(),
})

const BusinessPlanSchema = z.object({
  type: z.literal('business-plan'),
  businessIdea: z.string().min(1, 'Business idea is required'),
  targetMarket: z.string().min(1, 'Target market is required'),
  businessModel: z.string().optional(),
  fundingGoal: z.number().optional(),
  timeline: z.string().optional(),
  experience: z.string().optional(),
})

const GenericTemplateSchema = z.object({
  type: z.literal('generic'),
  templateType: z.string().min(1, 'Template type is required'),
  requirements: z.string().min(1, 'Requirements are required'),
  context: z.string().optional(),
  tone: z.string().optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
})

const TemplateRequestSchema = z.discriminatedUnion('type', [
  SalesScriptSchema,
  OfferNamingSchema,
  EmailCampaignSchema,
  BusinessPlanSchema,
  GenericTemplateSchema,
])

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { allowed } = rateLimitByIp('templates:generate', ip, 60_000, 10)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = TemplateRequestSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const templateData = parsed.data
    const client = getOpenAIClient()

    let generatedContent: any

    try {
      switch (templateData.type) {
        case 'sales-script':
          generatedContent = await generateSalesScripts(client, templateData)
          break
        case 'offer-naming':
          generatedContent = await generateOfferNames(client, templateData)
          break
        case 'email-campaign':
          generatedContent = await generateEmailCampaign(client, templateData)
          break
        case 'business-plan':
          generatedContent = await generateBusinessPlan(client, templateData)
          break
        case 'generic':
          generatedContent = await generateGenericTemplate(client, templateData)
          break
        default:
          return NextResponse.json({ error: 'Unsupported template type' }, { status: 400 })
      }

      logInfo('Template generated successfully', {
        userId: user.id,
        templateType: templateData.type,
        contentLength: JSON.stringify(generatedContent).length
      })

      return NextResponse.json({
        success: true,
        templateType: templateData.type,
        content: generatedContent,
        metadata: {
          generatedAt: new Date().toISOString(),
          userId: user.id,
          tokenUsage: generatedContent.tokenUsage || null
        }
      })

    } catch (aiError) {
      logError('AI generation failed', { userId: user.id, templateType: templateData.type }, aiError as Error)
      
      // Return fallback content if AI fails
      return NextResponse.json({
        success: true,
        templateType: templateData.type,
        content: getFallbackContent(templateData.type, templateData),
        metadata: {
          generatedAt: new Date().toISOString(),
          userId: user.id,
          fallback: true,
          error: 'AI generation failed, using fallback content'
        }
      })
    }

  } catch (error) {
    logError('Template generation error', {}, error as Error)
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    )
  }
}

async function generateSalesScripts(client: OpenAI, data: any) {
  const prompt = `Generate 3 different sales scripts for ${data.platform} targeting ${data.persona}.

Requirements:
- Platform: ${data.platform}
- Tone: ${data.tone}
- Target: ${data.persona}
- Offer: ${data.offerDetails}
${data.industry ? `- Industry: ${data.industry}` : ''}
${data.painPoints?.length ? `- Pain Points: ${data.painPoints.join(', ')}` : ''}

Each script should be:
- Platform-appropriate (consider character limits for social media)
- Personalized and engaging
- Focused on value proposition
- Include a clear call-to-action

Return as JSON array with objects containing: script, platform, tone, keyMessage, callToAction`

  const response = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 1500,
  })

  try {
    return JSON.parse(response.choices[0].message.content || '[]')
  } catch {
    // Fallback parsing if JSON is malformed
    const content = response.choices[0].message.content || ''
    return content.split('\n').filter(line => line.trim()).map((script, index) => ({
      script: script.trim(),
      platform: data.platform,
      tone: data.tone,
      keyMessage: `Generated message ${index + 1}`,
      callToAction: 'Learn more'
    }))
  }
}

async function generateOfferNames(client: OpenAI, data: any) {
  const prompt = `Generate 5 creative offer names for a product targeting ${data.targetAudience}.

Product Description: ${data.productDescription}
Target Audience: ${data.targetAudience}
${data.pricePoint ? `Price Point: ${data.pricePoint}` : ''}
${data.industry ? `Industry: ${data.industry}` : ''}
${data.keyBenefits?.length ? `Key Benefits: ${data.keyBenefits.join(', ')}` : ''}
${data.tone ? `Tone: ${data.tone}` : ''}

Each name should include:
- The name itself
- Reasoning for why it works
- Vibe/feeling it conveys
- Tone it sets

Return as JSON array with objects containing: name, reason, vibe, tone`

  const response = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.9,
    max_tokens: 1200,
  })

  try {
    return JSON.parse(response.choices[0].message.content || '[]')
  } catch {
    // Fallback parsing
    return [
      {
        name: `${data.productDescription} Pro`,
        reason: 'Simple, professional, and clear about the product',
        vibe: 'Professional',
        tone: 'Confident'
      }
    ]
  }
}

async function generateEmailCampaign(client: OpenAI, data: any) {
  const prompt = `Generate ${data.emailCount} email templates for a ${data.campaignGoal} campaign.

Target Audience: ${data.targetAudience}
Product/Service: ${data.productService}
Tone: ${data.tone}
Campaign Goal: ${data.campaignGoal}
${data.callToAction ? `Call to Action: ${data.callToAction}` : ''}

Each email should:
- Have a compelling subject line
- Include engaging body content
- Be optimized for the campaign goal
- Include appropriate call-to-action
- Match the specified tone

Return as JSON array with objects containing: subject, body, callToAction, emailNumber`

  const response = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 2000,
  })

  try {
    return JSON.parse(response.choices[0].message.content || '[]')
  } catch {
    // Fallback parsing
    return [
      {
        subject: `Re: ${data.productService}`,
        body: `Hi there,\n\nI wanted to reach out about ${data.productService} that I think would be perfect for you.\n\nBest regards`,
        callToAction: data.callToAction || 'Learn More',
        emailNumber: 1
      }
    ]
  }
}

async function generateBusinessPlan(client: OpenAI, data: any) {
  const prompt = `Generate a comprehensive business plan outline for: ${data.businessIdea}

Target Market: ${data.targetMarket}
${data.businessModel ? `Business Model: ${data.businessModel}` : ''}
${data.fundingGoal ? `Funding Goal: $${data.fundingGoal}` : ''}
${data.timeline ? `Timeline: ${data.timeline}` : ''}
${data.experience ? `Founder Experience: ${data.experience}` : ''}

Include sections for:
- Executive Summary
- Company Description
- Market Analysis
- Organization & Management
- Service/Product Line
- Marketing & Sales Strategy
- Financial Projections
- Funding Request (if applicable)

Return as JSON object with detailed sections and subsections`

  const response = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.6,
    max_tokens: 3000,
  })

  try {
    return JSON.parse(response.choices[0].message.content || '{}')
  } catch {
    // Fallback parsing
    return {
      executiveSummary: `Business plan for ${data.businessIdea}`,
      companyDescription: 'Company description to be filled out',
      marketAnalysis: 'Market analysis to be completed'
    }
  }
}

async function generateGenericTemplate(client: OpenAI, data: any) {
  const prompt = `Generate a ${data.templateType} template based on these requirements:

Requirements: ${data.requirements}
${data.context ? `Context: ${data.context}` : ''}
${data.tone ? `Tone: ${data.tone}` : ''}
${data.length ? `Length: ${data.length}` : ''}

Create a comprehensive template that can be customized for different use cases. Include placeholders for customization.

Return as JSON object with the template structure and content`

  const response = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 2000,
  })

  try {
    return JSON.parse(response.choices[0].message.content || '{}')
  } catch {
    return {
      title: data.templateType,
      content: 'Template content to be generated',
      structure: 'Template structure to be defined'
    }
  }
}

function getFallbackContent(type: string, data: any) {
  switch (type) {
    case 'sales-script':
      return [
        {
          script: `Hi [Name], I noticed you're interested in ${data.offerDetails}. I help ${data.persona} achieve their goals. Would you like to learn more?`,
          platform: data.platform,
          tone: data.tone,
          keyMessage: 'Value proposition',
          callToAction: 'Learn more'
        }
      ]
    case 'offer-naming':
      return [
        {
          name: `${data.productDescription} Solution`,
          reason: 'Clear and descriptive name',
          vibe: 'Professional',
          tone: 'Direct'
        }
      ]
    case 'email-campaign':
      return [
        {
          subject: `About ${data.productService}`,
          body: `Hi there,\n\nI wanted to reach out about ${data.productService}.\n\nBest regards`,
          callToAction: 'Learn More',
          emailNumber: 1
        }
      ]
    default:
      return { content: 'Template generated successfully' }
  }
}
