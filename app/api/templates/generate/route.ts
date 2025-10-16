import { logger, logError, logInfo } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { rateLimitByIp } from '@/lib/rate-limit'
import { z } from 'zod'

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'


// Edge Runtime disabled due to Node.js dependency incompatibility

export const dynamic = 'force-dynamic'

const generateTemplateSchema = z.object({
  type: z.enum(['business-plan', 'marketing-strategy', 'financial-model', 'content-calendar', 'custom']),
  industry: z.string().min(1),
  businessStage: z.enum(['idea', 'early-stage', 'growth', 'scaling']),
  targetAudience: z.string().optional(),
  specificNeeds: z.array(z.string()).optional(),
  customPrompt: z.string().optional(),
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
    const templateRequest = generateTemplateSchema.parse(body)

    // Generate AI-powered template
    const template = await generateAITemplate(templateRequest, authResult.user.id)

    logInfo('AI template generated successfully', { userId: authResult.user.id, type: templateRequest.type })
    return NextResponse.json({ 
      success: true, 
      template 
    })
  } catch (error) {
    logError('Error generating AI template:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid template request', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateAITemplate(request: any, userId: string) {
  try {
    // Mock AI template generation - in production, this would use OpenAI
    const template = {
      id: `ai-template-${Date.now()}`,
      title: generateTemplateTitle(request),
      description: generateTemplateDescription(request),
      type: request.type,
      industry: request.industry,
      businessStage: request.businessStage,
      content: generateTemplateContent(request),
      sections: generateTemplateSections(request),
      estimatedTime: calculateEstimatedTime(request),
      difficulty: determineDifficulty(request),
      tags: generateTags(request),
      isAiGenerated: true,
      generatedAt: new Date().toISOString(),
      generatedBy: userId,
      aiInsights: generateAIInsights(request),
      recommendations: generateRecommendations(request)
    }

    return template
  } catch (error) {
    logError('Error in AI template generation:', error)
    throw error
  }
}

function generateTemplateTitle(request: any): string {
  const titleMap = {
    'business-plan': `${request.industry} Business Plan Template`,
    'marketing-strategy': `${request.industry} Marketing Strategy`,
    'financial-model': `${request.industry} Financial Projections`,
    'content-calendar': `${request.industry} Content Calendar`,
    'custom': `Custom ${request.industry} Template`
  }
  return titleMap[request.type] || `AI-Generated ${request.industry} Template`
}

function generateTemplateDescription(request: any): string {
  const stageDescriptions = {
    'idea': 'Perfect for validating your business concept and planning your launch',
    'early-stage': 'Designed for businesses in their first 1-2 years of operation',
    'growth': 'Optimized for scaling businesses ready to expand',
    'scaling': 'Advanced templates for established businesses looking to scale'
  }

  return `AI-powered template specifically designed for ${request.industry} businesses in the ${request.businessStage} stage. ${stageDescriptions[request.businessStage] || 'Customized for your business needs.'}`
}

function generateTemplateContent(request: any): any {
  const contentTemplates = {
    'business-plan': {
      executiveSummary: {
        title: 'Executive Summary',
        description: 'Overview of your business concept, market opportunity, and key objectives',
        fields: [
          { name: 'businessName', label: 'Business Name', type: 'text', required: true },
          { name: 'missionStatement', label: 'Mission Statement', type: 'textarea', required: true },
          { name: 'targetMarket', label: 'Target Market', type: 'text', required: true },
          { name: 'competitiveAdvantage', label: 'Competitive Advantage', type: 'textarea', required: true }
        ]
      },
      marketAnalysis: {
        title: 'Market Analysis',
        description: 'Research and analysis of your target market and competition',
        fields: [
          { name: 'marketSize', label: 'Total Addressable Market', type: 'number', required: true },
          { name: 'targetSegment', label: 'Target Customer Segment', type: 'text', required: true },
          { name: 'competitors', label: 'Key Competitors', type: 'textarea', required: true },
          { name: 'marketTrends', label: 'Market Trends', type: 'textarea', required: false }
        ]
      }
    },
    'marketing-strategy': {
      brandPositioning: {
        title: 'Brand Positioning',
        description: 'Define your unique value proposition and brand identity',
        fields: [
          { name: 'brandValues', label: 'Core Brand Values', type: 'textarea', required: true },
          { name: 'personality', label: 'Brand Personality', type: 'text', required: true },
          { name: 'tone', label: 'Brand Tone', type: 'text', required: true },
          { name: 'messaging', label: 'Key Messages', type: 'textarea', required: true }
        ]
      },
      customerJourney: {
        title: 'Customer Journey Map',
        description: 'Map out your customer touchpoints and experiences',
        fields: [
          { name: 'awareness', label: 'Awareness Stage', type: 'textarea', required: true },
          { name: 'consideration', label: 'Consideration Stage', type: 'textarea', required: true },
          { name: 'decision', label: 'Decision Stage', type: 'textarea', required: true },
          { name: 'retention', label: 'Retention Strategy', type: 'textarea', required: true }
        ]
      }
    }
  }

  return contentTemplates[request.type] || generateCustomContent(request)
}

function generateTemplateSections(request: any): string[] {
  const sectionMap = {
    'business-plan': [
      'Executive Summary',
      'Company Description',
      'Market Analysis',
      'Organization & Management',
      'Service/Product Line',
      'Marketing & Sales',
      'Financial Projections',
      'Funding Request',
      'Appendix'
    ],
    'marketing-strategy': [
      'Brand Positioning',
      'Target Audience',
      'Customer Journey',
      'Marketing Channels',
      'Content Strategy',
      'Budget Allocation',
      'Success Metrics',
      'Timeline'
    ],
    'financial-model': [
      'Revenue Projections',
      'Cost Structure',
      'Cash Flow Analysis',
      'Break-even Analysis',
      'Funding Requirements',
      'ROI Projections',
      'Sensitivity Analysis'
    ],
    'content-calendar': [
      'Content Themes',
      'Platform Strategy',
      'Monthly Calendar',
      'Content Types',
      'Publishing Schedule',
      'Performance Metrics',
      'Content Ideas Bank'
    ]
  }

  return sectionMap[request.type] || ['Overview', 'Planning', 'Implementation', 'Review']
}

function calculateEstimatedTime(request: any): string {
  const timeMap = {
    'business-plan': '2-3 hours',
    'marketing-strategy': '1-2 hours',
    'financial-model': '1-3 hours',
    'content-calendar': '1 hour',
    'custom': '30-60 minutes'
  }
  return timeMap[request.type] || '1 hour'
}

function determineDifficulty(request: any): 'beginner' | 'intermediate' | 'advanced' {
  const difficultyMap = {
    'business-plan': 'advanced',
    'marketing-strategy': 'intermediate',
    'financial-model': 'advanced',
    'content-calendar': 'beginner',
    'custom': 'intermediate'
  }
  return difficultyMap[request.type] || 'intermediate'
}

function generateTags(request: any): string[] {
  const baseTags = [request.industry, request.businessStage, request.type]
  const industryTags = {
    'technology': ['saas', 'startup', 'innovation'],
    'healthcare': ['wellness', 'medical', 'patient-care'],
    'finance': ['fintech', 'investment', 'financial-services'],
    'education': ['edtech', 'learning', 'training'],
    'retail': ['ecommerce', 'consumer', 'sales']
  }
  
  const additionalTags = industryTags[request.industry.toLowerCase()] || ['business', 'planning']
  return [...baseTags, ...additionalTags].filter(Boolean)
}

function generateAIInsights(request: any): string[] {
  return [
    `Based on ${request.industry} industry trends, consider focusing on digital transformation opportunities`,
    `${request.businessStage} stage businesses typically benefit from customer feedback loops`,
    'AI-powered analytics can help optimize your strategy in real-time',
    'Consider implementing automated workflows for efficiency'
  ]
}

function generateRecommendations(request: any): string[] {
  const recommendations = {
    'idea': [
      'Validate your concept with potential customers',
      'Research competitors and market gaps',
      'Develop a minimum viable product (MVP)',
      'Create a simple financial projection'
    ],
    'early-stage': [
      'Focus on customer acquisition and retention',
      'Establish key performance indicators (KPIs)',
      'Build strategic partnerships',
      'Optimize your operations for efficiency'
    ],
    'growth': [
      'Scale your marketing efforts',
      'Expand your product/service offerings',
      'Consider team expansion',
      'Implement advanced analytics'
    ],
    'scaling': [
      'Automate repetitive processes',
      'Develop strategic partnerships',
      'Consider acquisition opportunities',
      'Focus on market expansion'
    ]
  }

  return recommendations[request.businessStage] || [
    'Set clear objectives and timelines',
    'Monitor progress regularly',
    'Adjust strategy based on results',
    'Seek feedback from stakeholders'
  ]
}

function generateCustomContent(request: any): any {
  return {
    customSection: {
      title: 'Custom Template Section',
      description: 'AI-generated content based on your specific requirements',
      fields: [
        { name: 'customField1', label: 'Custom Field 1', type: 'text', required: true },
        { name: 'customField2', label: 'Custom Field 2', type: 'textarea', required: false },
        { name: 'customField3', label: 'Custom Field 3', type: 'text', required: false }
      ]
    }
  }
}