jest.mock('@/lib/neon/server', () => ({
  createClient: jest.fn().mockResolvedValue({
    query: jest.fn().mockResolvedValue({ 
      rows: [{ 
        id: 'test-task-id', 
        title: 'Test Task', 
        description: 'Test description',
        status: 'pending',
        priority: 'medium',
        due_date: '2024-12-31T23:59:59.000Z',
        category: 'general',
        user_id: 'test-user-id',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z'
      }] 
    }),
    release: jest.fn(),
  }),
}))

jest.mock('@/lib/auth-server', () => ({
  authenticateRequest: jest.fn().mockResolvedValue({
    user: { id: 'test-user-id' },
    error: null
  }),
}))

describe('Tasks API due_date validation', () => {
  let POST: any

  beforeEach(() => {
    jest.resetModules()
    const module = require('@/app/api/tasks/route')
    POST = module.POST
  })

  it('should accept valid ISO 8601 datetime string', async () => {
    const validDueDates = [
      '2024-12-31T23:59:59.000Z',
      '2024-06-15T14:30:00.000Z',
      '2025-01-01T00:00:00Z'
    ]

    for (const due_date of validDueDates) {
      const body = JSON.stringify({
        title: 'Test Task',
        description: 'Test description',
        due_date: due_date
      })
      
      const req = new Request('http://localhost', {
        method: 'POST',
        body,
        headers: { 'content-type': 'application/json' }
      })
      
      const res = await POST(req)
      expect(res.status).toBe(201)
    }
  })

  it('should reject invalid date strings', async () => {
    const invalidDueDates = [
      'invalid-date',
      '2024-13-32',
      'next Friday',
      '2024/12/31',
      '12-31-2024'
    ]

    for (const due_date of invalidDueDates) {
      const body = JSON.stringify({
        title: 'Test Task',
        description: 'Test description',
        due_date: due_date
      })
      
      const req = new Request('http://localhost', {
        method: 'POST',
        body,
        headers: { 'content-type': 'application/json' }
      })
      
      const res = await POST(req)
      expect(res.status).toBe(400)
      
      const responseData = await res.json()
      expect(responseData.error).toBe('Invalid payload')
    }
  })

  it('should accept no due_date (optional field)', async () => {
    const body = JSON.stringify({
      title: 'Test Task',
      description: 'Test description'
    })
    
    const req = new Request('http://localhost', {
      method: 'POST',
      body,
      headers: { 'content-type': 'application/json' }
    })
    
    const res = await POST(req)
    expect(res.status).toBe(201)
  })

  it('should accept null due_date', async () => {
    const body = JSON.stringify({
      title: 'Test Task',
      description: 'Test description',
      due_date: null
    })
    
    const req = new Request('http://localhost', {
      method: 'POST',
      body,
      headers: { 'content-type': 'application/json' }
    })
    
    const res = await POST(req)
    expect(res.status).toBe(201)
  })
})