import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { logInfo, logError } from '@/lib/logger'
import * as jose from 'jose'
import { getNeonConnection, safeDbQuery } from '@/lib/database-utils'

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'


// // Edge Runtime disabled due to Node.js dependency incompatibility

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic'

function getSql() {
  return getNeonConnection()
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload: decoded } = await jose.jwtVerify(token, secret)
    const userId = decoded.user_id

    logInfo('Fetching available learning modules', { userId })

    // Try to get modules from database
    const modules = await safeDbQuery(
      async () => {
        const sql = getSql()
        if (!sql) {
          throw new Error('Database connection not available')
        }
        return await sql`
          SELECT id, title, description, skill_id, content_type, duration_minutes,
                 difficulty, content_url, quiz_questions, exercises
          FROM learning_modules
          ORDER BY difficulty, duration_minutes
        `
      },
      getDefaultModules() // fallback to default modules
    )

    return NextResponse.json(modules)
  } catch (error) {
    logError('Error fetching learning modules', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function getDefaultModules() {
  return [
    {
      id: 'business-model-canvas',
      title: 'Business Model Canvas',
      description: 'Learn how to design and validate your business model using the Business Model Canvas framework.',
      skill_id: 'entrepreneurship-fundamentals',
      content_type: 'interactive',
      duration_minutes: 45,
      difficulty: 'beginner',
      content_url: null,
      quiz_questions: [
        {
          id: 'bmc-value-prop',
          question: 'What is the primary purpose of the Value Proposition section in the Business Model Canvas?',
          options: [
            'To define your pricing strategy',
            'To describe the unique value you offer to customers',
            'To list your competitors',
            'To outline your marketing plan'
          ],
          correct_answer: 1,
          explanation: 'The Value Proposition section describes the unique value you offer to customers and how you solve their problems.'
        },
        {
          id: 'bmc-customer-segments',
          question: 'Customer Segments help you identify:',
          options: [
            'Your pricing strategy',
            'Who your target customers are',
            'Your revenue streams',
            'Your key partnerships'
          ],
          correct_answer: 1,
          explanation: 'Customer Segments help you identify and understand who your target customers are.'
        }
      ],
      exercises: [
        {
          id: 'bmc-practice',
          title: 'Create Your Business Model Canvas',
          description: 'Fill out a Business Model Canvas for your business idea.',
          instructions: 'Complete each section of the Business Model Canvas with specific details about your business.',
          hints: [
            'Start with your Value Proposition - what problem are you solving?',
            'Be specific about your Customer Segments',
            'Consider multiple Revenue Streams'
          ]
        }
      ]
    },
    {
      id: 'market-research-basics',
      title: 'Market Research Fundamentals',
      description: 'Master the basics of conducting market research to validate your business idea.',
      skill_id: 'entrepreneurship-fundamentals',
      content_type: 'article',
      duration_minutes: 60,
      difficulty: 'beginner',
      content_url: null,
      quiz_questions: [
        {
          id: 'mr-primary-research',
          question: 'Which of the following is an example of primary market research?',
          options: [
            'Reading industry reports',
            'Conducting customer surveys',
            'Analyzing competitor websites',
            'Reviewing market statistics'
          ],
          correct_answer: 1,
          explanation: 'Primary research involves collecting new data directly from your target market, such as through surveys.'
        }
      ],
      exercises: [
        {
          id: 'mr-survey-design',
          title: 'Design a Market Research Survey',
          description: 'Create a survey to gather insights about your target market.',
          instructions: 'Design a 10-question survey to understand your customers\' needs and preferences.',
          hints: [
            'Include demographic questions',
            'Ask about pain points and challenges',
            'Include questions about purchasing behavior'
          ]
        }
      ]
    },
    {
      id: 'social-media-strategy',
      title: 'Social Media Marketing Strategy',
      description: 'Develop a comprehensive social media marketing strategy for your business.',
      skill_id: 'digital-marketing',
      content_type: 'video',
      duration_minutes: 90,
      difficulty: 'intermediate',
      content_url: 'https://example.com/social-media-strategy-video',
      quiz_questions: [
        {
          id: 'sm-content-calendar',
          question: 'What is the main benefit of using a content calendar?',
          options: [
            'It increases follower count',
            'It helps plan and organize content consistently',
            'It automatically posts content',
            'It tracks engagement metrics'
          ],
          correct_answer: 1,
          explanation: 'A content calendar helps plan and organize content consistently, ensuring regular posting and strategic content distribution.'
        }
      ],
      exercises: [
        {
          id: 'sm-content-plan',
          title: 'Create a Content Marketing Plan',
          description: 'Develop a 30-day content marketing plan for your business.',
          instructions: 'Plan content for one month across your chosen social media platforms.',
          hints: [
            'Mix educational, promotional, and engaging content',
            'Consider your audience\'s interests',
            'Plan for different types of posts (images, videos, text)'
          ]
        }
      ]
    },
    {
      id: 'financial-statements',
      title: 'Understanding Financial Statements',
      description: 'Learn to read and interpret basic financial statements for your business.',
      skill_id: 'financial-management',
      content_type: 'interactive',
      duration_minutes: 75,
      difficulty: 'intermediate',
      content_url: null,
      quiz_questions: [
        {
          id: 'fs-balance-sheet',
          question: 'What does a Balance Sheet show?',
          options: [
            'Revenue and expenses over time',
            'Assets, liabilities, and equity at a point in time',
            'Cash flow in and out',
            'Profit and loss'
          ],
          correct_answer: 1,
          explanation: 'A Balance Sheet shows assets, liabilities, and equity at a specific point in time.'
        }
      ],
      exercises: [
        {
          id: 'fs-create-statement',
          title: 'Create a Simple Income Statement',
          description: 'Practice creating a basic income statement for your business.',
          instructions: 'Create an income statement showing revenue, expenses, and net profit for one month.',
          hints: [
            'Start with your total revenue',
            'List all business expenses',
            'Calculate net profit (revenue - expenses)'
          ]
        }
      ]
    },
    {
      id: 'team-building',
      title: 'Building High-Performing Teams',
      description: 'Learn strategies for building and managing effective teams.',
      skill_id: 'leadership-skills',
      content_type: 'article',
      duration_minutes: 120,
      difficulty: 'advanced',
      content_url: null,
      quiz_questions: [
        {
          id: 'tb-team-dynamics',
          question: 'What is the most important factor in building team trust?',
          options: [
            'Regular team meetings',
            'Clear communication and transparency',
            'Team building activities',
            'Performance bonuses'
          ],
          correct_answer: 1,
          explanation: 'Clear communication and transparency are fundamental to building trust within teams.'
        }
      ],
      exercises: [
        {
          id: 'tb-team-assessment',
          title: 'Assess Your Team Dynamics',
          description: 'Evaluate your current team\'s strengths and areas for improvement.',
          instructions: 'Create a team assessment covering communication, collaboration, and performance.',
          hints: [
            'Consider individual strengths and weaknesses',
            'Evaluate team communication patterns',
            'Identify areas for skill development'
          ]
        }
      ]
    },
    {
      id: 'sales-funnel',
      title: 'Building an Effective Sales Funnel',
      description: 'Design and optimize sales funnels to convert prospects into customers.',
      skill_id: 'sales-techniques',
      content_type: 'video',
      duration_minutes: 80,
      difficulty: 'intermediate',
      content_url: 'https://example.com/sales-funnel-video',
      quiz_questions: [
        {
          id: 'sf-funnel-stages',
          question: 'What are the typical stages of a sales funnel?',
          options: [
            'Awareness, Interest, Decision, Action',
            'Marketing, Sales, Support, Retention',
            'Lead, Prospect, Customer, Advocate',
            'All of the above'
          ],
          correct_answer: 3,
          explanation: 'All of these represent valid ways to describe sales funnel stages depending on the model used.'
        }
      ],
      exercises: [
        {
          id: 'sf-design-funnel',
          title: 'Design Your Sales Funnel',
          description: 'Create a sales funnel for your product or service.',
          instructions: 'Map out each stage of your sales funnel and identify key actions at each stage.',
          hints: [
            'Start with how customers discover you',
            'Define clear actions for each stage',
            'Consider how to nurture leads'
          ]
        }
      ]
    },
    {
      id: 'customer-feedback',
      title: 'Collecting and Acting on Customer Feedback',
      description: 'Learn to gather, analyze, and implement customer feedback effectively.',
      skill_id: 'customer-service',
      content_type: 'interactive',
      duration_minutes: 50,
      difficulty: 'beginner',
      content_url: null,
      quiz_questions: [
        {
          id: 'cf-feedback-types',
          question: 'Which method is most effective for collecting detailed customer feedback?',
          options: [
            'Social media polls',
            'In-depth customer interviews',
            'Online reviews',
            'Quick surveys'
          ],
          correct_answer: 1,
          explanation: 'In-depth customer interviews provide the most detailed and actionable feedback.'
        }
      ],
      exercises: [
        {
          id: 'cf-feedback-system',
          title: 'Create a Customer Feedback System',
          description: 'Design a system for collecting and managing customer feedback.',
          instructions: 'Create a plan for gathering, organizing, and acting on customer feedback.',
          hints: [
            'Consider multiple feedback channels',
            'Plan how to categorize feedback',
            'Define response procedures'
          ]
        }
      ]
    },
    {
      id: 'agile-methodology',
      title: 'Agile Project Management',
      description: 'Learn agile principles and practices for managing projects effectively.',
      skill_id: 'project-management',
      content_type: 'article',
      duration_minutes: 100,
      difficulty: 'intermediate',
      content_url: null,
      quiz_questions: [
        {
          id: 'agile-sprints',
          question: 'What is a sprint in agile methodology?',
          options: [
            'A long-term project phase',
            'A short, time-boxed iteration',
            'A meeting format',
            'A type of project deliverable'
          ],
          correct_answer: 1,
          explanation: 'A sprint is a short, time-boxed iteration where work is completed and reviewed.'
        }
      ],
      exercises: [
        {
          id: 'agile-planning',
          title: 'Plan Your First Sprint',
          description: 'Practice agile planning by organizing a small project into sprints.',
          instructions: 'Break down a project into sprints and plan the first sprint\'s tasks.',
          hints: [
            'Keep sprints short (1-2 weeks)',
            'Include planning, execution, and review',
            'Estimate task complexity'
          ]
        }
      ]
    },
    {
      id: 'time-blocking',
      title: 'Time Blocking and Deep Work',
      description: 'Master time blocking techniques to maximize productivity and focus.',
      skill_id: 'time-management',
      content_type: 'video',
      duration_minutes: 40,
      difficulty: 'beginner',
      content_url: 'https://example.com/time-blocking-video',
      quiz_questions: [
        {
          id: 'tb-deep-work',
          question: 'What is deep work?',
          options: [
            'Working for long hours',
            'Working on multiple tasks simultaneously',
            'Professional activities performed in a distraction-free state',
            'Working late at night'
          ],
          correct_answer: 2,
          explanation: 'Deep work refers to professional activities performed in a distraction-free state of concentration.'
        }
      ],
      exercises: [
        {
          id: 'tb-schedule-design',
          title: 'Design Your Time Blocking Schedule',
          description: 'Create a time blocking schedule for your typical workday.',
          instructions: 'Block out time for different types of work and activities throughout your day.',
          hints: [
            'Include blocks for deep work',
            'Schedule breaks between blocks',
            'Consider your energy levels'
          ]
        }
      ]
    }
  ]
}
