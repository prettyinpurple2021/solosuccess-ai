import { NextResponse } from 'next/server'

jest.mock('@/lib/auth-server', () => ({
  authenticateRequest: jest.fn(),
}))

jest.mock('@/lib/neon/server', () => ({
  createClient: jest.fn(),
}))

describe('Tasks API Enum Validation', () => {
  const { authenticateRequest } = jest.requireMock('@/lib/auth-server') as {
    authenticateRequest: jest.Mock
  }
  const { createClient } = jest.requireMock('@/lib/neon/server') as {
    createClient: jest.Mock
  }

  // Import after mocks are set up
  const { POST: createTask } = require('@/app/api/tasks/route') as typeof import('@/app/api/tasks/route')
  const { POST: bulkUpdate } = require('@/app/api/tasks/bulk-update/route') as typeof import('@/app/api/tasks/bulk-update/route')

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock successful authentication by default
    authenticateRequest.mockResolvedValue({ user: { id: 'user-1' }, error: null })
    // Mock successful database response
    const queryMock = jest.fn().mockResolvedValue({ rows: [{ id: 'task-1' }] })
    createClient.mockResolvedValue({ query: queryMock })
  })

  describe('POST /api/tasks - Create Task', () => {
    it('accepts valid priority enum values', async () => {
      const validPriorities = ['low', 'medium', 'high', 'urgent']
      
      for (const priority of validPriorities) {
        const body = JSON.stringify({
          title: 'Test Task',
          priority: priority
        })
        const req = new Request('http://localhost', { method: 'POST', body })
        
        const res = await createTask(req) as NextResponse
        expect(res.status).toBe(201)
      }
    })

    it('accepts valid status enum values', async () => {
      const validStatuses = ['todo', 'in_progress', 'completed', 'cancelled']
      
      for (const status of validStatuses) {
        const body = JSON.stringify({
          title: 'Test Task',
          status: status
        })
        const req = new Request('http://localhost', { method: 'POST', body })
        
        const res = await createTask(req) as NextResponse
        expect(res.status).toBe(201)
      }
    })

    it('rejects invalid priority values', async () => {
      const invalidPriorities = ['invalid', 'URGENT', 'super-high', '']
      
      for (const priority of invalidPriorities) {
        const body = JSON.stringify({
          title: 'Test Task',
          priority: priority
        })
        const req = new Request('http://localhost', { method: 'POST', body })
        
        const res = await createTask(req) as NextResponse
        expect(res.status).toBe(400)
        const responseBody = await res.json()
        expect(responseBody.error).toBe('Invalid payload')
      }
    })

    it('rejects invalid status values', async () => {
      const invalidStatuses = ['pending', 'active', 'COMPLETED', 'done', '']
      
      for (const status of invalidStatuses) {
        const body = JSON.stringify({
          title: 'Test Task',
          status: status
        })
        const req = new Request('http://localhost', { method: 'POST', body })
        
        const res = await createTask(req) as NextResponse
        expect(res.status).toBe(400)
        const responseBody = await res.json()
        expect(responseBody.error).toBe('Invalid payload')
      }
    })

    it('works without optional status and priority (uses defaults)', async () => {
      const body = JSON.stringify({
        title: 'Test Task'
      })
      const req = new Request('http://localhost', { method: 'POST', body })
      
      const res = await createTask(req) as NextResponse
      expect(res.status).toBe(201)
    })
  })

  describe('POST /api/tasks/bulk-update - Bulk Update Tasks', () => {
    it('accepts valid status enum values for bulk update', async () => {
      const validStatuses = ['todo', 'in_progress', 'completed', 'cancelled']
      
      for (const status of validStatuses) {
        const body = JSON.stringify({
          ids: ['task-1', 'task-2'],
          status: status
        })
        const req = new Request('http://localhost', { method: 'POST', body })
        
        const res = await bulkUpdate(req) as NextResponse
        expect(res.status).toBe(200)
      }
    })

    it('accepts valid priority enum values for bulk update', async () => {
      const validPriorities = ['low', 'medium', 'high', 'urgent']
      
      for (const priority of validPriorities) {
        const body = JSON.stringify({
          ids: ['task-1', 'task-2'],
          priority: priority
        })
        const req = new Request('http://localhost', { method: 'POST', body })
        
        const res = await bulkUpdate(req) as NextResponse
        expect(res.status).toBe(200)
      }
    })

    it('rejects invalid status values for bulk update', async () => {
      const invalidStatuses = ['pending', 'active', 'COMPLETED', 'done']
      
      for (const status of invalidStatuses) {
        const body = JSON.stringify({
          ids: ['task-1'],
          status: status
        })
        const req = new Request('http://localhost', { method: 'POST', body })
        
        const res = await bulkUpdate(req) as NextResponse
        expect(res.status).toBe(400)
        const responseBody = await res.json()
        expect(responseBody.error).toBe('Invalid payload')
      }
    })

    it('rejects invalid priority values for bulk update', async () => {
      const invalidPriorities = ['invalid', 'URGENT', 'super-high']
      
      for (const priority of invalidPriorities) {
        const body = JSON.stringify({
          ids: ['task-1'],
          priority: priority
        })
        const req = new Request('http://localhost', { method: 'POST', body })
        
        const res = await bulkUpdate(req) as NextResponse
        expect(res.status).toBe(400)
        const responseBody = await res.json()
        expect(responseBody.error).toBe('Invalid payload')
      }
    })

    it('accepts both valid status and priority together', async () => {
      const body = JSON.stringify({
        ids: ['task-1'],
        status: 'in_progress',
        priority: 'high'
      })
      const req = new Request('http://localhost', { method: 'POST', body })
      
      const res = await bulkUpdate(req) as NextResponse
      expect(res.status).toBe(200)
    })
  })
})