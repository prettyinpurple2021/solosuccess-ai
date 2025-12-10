import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const apiRoot = path.join(projectRoot, 'app', 'api')

const defaultJsonSchema = { type: 'object', additionalProperties: true }
const defaultResponses = {
  200: {
    description: 'Successful response',
    content: { 'application/json': { schema: defaultJsonSchema } }
  },
  400: { description: 'Bad request' },
  401: { description: 'Unauthorized' },
  429: { description: 'Rate limited' },
  500: { description: 'Internal server error' }
}

const overrides = {
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          full_name: { type: 'string', nullable: true },
          username: { type: 'string', nullable: true },
          date_of_birth: { type: 'string', format: 'date', nullable: true },
          subscription_tier: { type: 'string' },
          subscription_status: { type: 'string' },
          stripe_customer_id: { type: 'string', nullable: true },
          stripe_subscription_id: { type: 'string', nullable: true },
          current_period_start: { type: 'string', format: 'date-time', nullable: true },
          current_period_end: { type: 'string', format: 'date-time', nullable: true },
          cancel_at_period_end: { type: 'boolean', nullable: true },
          created_at: { type: 'string', format: 'date-time' }
        },
        additionalProperties: true,
        required: ['id', 'email', 'subscription_tier', 'subscription_status']
      },
      AuthResponse: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' },
          token: { type: 'string' },
          message: { type: 'string' }
        },
        required: ['user', 'token']
      },
      AuthErrorResponse: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          details: { type: 'string', nullable: true }
        },
        required: ['error']
      },
      AuthSigninRequest: {
        type: 'object',
        properties: {
          identifier: { type: 'string', description: 'Email or username' },
          password: { type: 'string', format: 'password' },
          isEmail: { type: 'boolean', description: 'Treat identifier as email' }
        },
        required: ['identifier', 'password']
      },
      AuthSignupRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
          metadata: {
            type: 'object',
            properties: {
              full_name: { type: 'string' },
              username: { type: 'string' },
              date_of_birth: { type: 'string', format: 'date' }
            },
            additionalProperties: true
          }
        },
        required: ['email', 'password']
      },
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ok' },
          timestamp: { type: 'string', format: 'date-time' },
          environment: { type: 'string' },
          nextVersion: { type: 'string' },
          port: { type: 'string' },
          hostname: { type: 'string' }
        },
        required: ['status', 'timestamp']
      },
      ChatRequest: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          agentId: { type: 'string', nullable: true }
        },
        required: ['message']
      },
      ChatError: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          upgradeRequired: { type: 'boolean', nullable: true },
          limit: { type: 'integer', nullable: true }
        },
        required: ['error']
      },
      DashboardResponse: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' },
          stats: { type: 'object', additionalProperties: true },
          todaysTasks: { type: 'array', items: defaultJsonSchema },
          insights: { type: 'array', items: defaultJsonSchema },
          recentConversations: { type: 'array', items: defaultJsonSchema },
          recentAchievements: { type: 'array', items: defaultJsonSchema },
          weeklyFocus: { type: 'object', additionalProperties: true },
          briefcases: { type: 'array', items: defaultJsonSchema }
        },
        additionalProperties: true
      }
    }
  },
  paths: {
    '/api/health': {
      get: {
        summary: 'Health status',
        tags: ['system'],
        responses: {
          200: {
            description: 'Service is healthy',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthResponse' } } }
          },
          500: {
            description: 'Health check failed',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthErrorResponse' } } }
          }
        }
      }
    },
    '/api/auth/signin': {
      post: {
        summary: 'User signin',
        tags: ['auth'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthSigninRequest' } } }
        },
        responses: {
          200: {
            description: 'Authenticated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } }
          },
          400: { description: 'Missing credentials' },
          401: {
            description: 'Invalid credentials',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthErrorResponse' } } }
          },
          500: { description: 'Server error' }
        }
      }
    },
    '/api/auth/signup': {
      post: {
        summary: 'Create user account',
        tags: ['auth'],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthSignupRequest' } } }
        },
        responses: {
          200: {
            description: 'User created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } }
          },
          409: { description: 'User already exists' },
          500: { description: 'Server error' }
        }
      }
    },
    '/api/chat': {
      post: {
        summary: 'Send chat message to agent',
        tags: ['chat'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ChatRequest' } } }
        },
        responses: {
          200: { description: 'Streaming text response', content: { 'text/plain': { schema: { type: 'string' } } } },
          400: { description: 'Invalid payload', content: { 'application/json': { schema: { $ref: '#/components/schemas/ChatError' } } } },
          401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/ChatError' } } } },
          403: { description: 'Access limited', content: { 'application/json': { schema: { $ref: '#/components/schemas/ChatError' } } } },
          429: { description: 'Rate limited' },
          503: { description: 'AI service unavailable' }
        }
      }
    },
    '/api/dashboard': {
      get: {
        summary: 'Dashboard summary',
        tags: ['dashboard'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Dashboard data', content: { 'application/json': { schema: { $ref: '#/components/schemas/DashboardResponse' } } } },
          401: { description: 'Unauthorized' },
          500: { description: 'Server error' }
        }
      }
    }
  }
}

const spec = {
  openapi: '3.1.0',
  info: {
    title: 'SoloSuccess AI API',
    description: 'OpenAPI documentation generated from Next.js route handlers.',
    version: '1.0.0'
  },
  servers: [{ url: '/', description: 'Application server' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: { ...overrides.components.schemas }
  },
  paths: {}
}

async function walk(dir, segments = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await walk(path.join(dir, entry.name), [...segments, entry.name])
      continue
    }

    if (!/^route\.(ts|js|tsx|mjs)$/.test(entry.name)) continue

    const routePath = toApiPath(segments)
    const filePath = path.join(dir, entry.name)
    const content = await fs.readFile(filePath, 'utf8')
    const methods = extractMethods(content)

    if (methods.size === 0) continue

    if (!spec.paths[routePath]) spec.paths[routePath] = {}

    for (const method of methods) {
      spec.paths[routePath][method] = buildOperation(routePath, method, content)
    }
  }
}

function toApiPath(segments) {
  if (segments.length === 0) return '/api'
  const normalized = segments
    .map((segment) => segment.replace(/\[([^\]]+)\]/g, '{$1}'))
    .join('/')
  return `/api/${normalized}`
}

function extractMethods(content) {
  const methods = new Set()
  const regex = /export\s+(?:async\s+function|const)\s+(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)/g
  let match
  while ((match = regex.exec(content)) !== null) {
    methods.add(match[1].toLowerCase())
  }
  return methods
}

function buildOperation(routePath, method, content) {
  const segments = routePath.replace(/^\/api\/?/, '').split('/').filter(Boolean)
  const summary = segments.length > 0 ? `${method.toUpperCase()} ${segments.join(' ')}` : `${method.toUpperCase()} root`
  const tags = segments.length > 0 ? [segments[0]] : ['general']

  const requiresAuth = /authenticateRequest|authorization|auth_token|jwtVerify/i.test(content)
  const operationId = `${method}-${segments.join('-') || 'root'}`

  const operation = {
    summary,
    operationId,
    tags,
    responses: { ...defaultResponses }
  }

  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    operation.requestBody = {
      required: false,
      content: { 'application/json': { schema: defaultJsonSchema } }
    }
  }

  if (requiresAuth) {
    operation.security = [{ bearerAuth: [] }]
  }

  return operation
}

function mergeOverrides() {
  for (const [routePath, operations] of Object.entries(overrides.paths)) {
    spec.paths[routePath] = { ...(spec.paths[routePath] || {}) }
    for (const [method, operation] of Object.entries(operations)) {
      spec.paths[routePath][method] = operation
    }
  }
}

async function main() {
  await walk(apiRoot)
  mergeOverrides()

  const outputPath = path.join(projectRoot, 'openapi.json')
  await fs.writeFile(outputPath, JSON.stringify(spec, null, 2))
}

main().catch((error) => {
  console.error('Failed to generate OpenAPI spec', error)
  process.exit(1)
})

