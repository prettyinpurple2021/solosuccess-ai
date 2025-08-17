import { NextRequest } from 'next/server'

jest.mock('@/lib/auth-server', () => ({
  authenticateRequest: jest.fn(),
}))

jest.mock('@/lib/neon/server', () => ({
  createClient: jest.fn(),
}))

describe('GET /api/dashboard - Completed Today Fix', () => {
  const { authenticateRequest } = jest.requireMock('@/lib/auth-server') as {
    authenticateRequest: jest.Mock
  }
  const { createClient } = jest.requireMock('@/lib/neon/server') as {
    createClient: jest.Mock
  }

  // Import after mocks are set up
  const { GET } = require('@/app/api/dashboard/route') as typeof import('@/app/api/dashboard/route')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should use completed_at field for tasks_completed calculation', async () => {
    const mockUser = { id: 'user-123' }
    authenticateRequest.mockResolvedValue({ user: mockUser, error: null })

    const mockClient = {
      query: jest.fn()
    }
    createClient.mockResolvedValue(mockClient)

    // Mock the database responses
    mockClient.query
      .mockResolvedValueOnce({ rows: [{ // User data query
        id: 'user-123',
        email: 'test@example.com',
        full_name: 'Test User',
        avatar_url: null,
        subscription_tier: 'free'
      }] })
      .mockResolvedValueOnce({ rows: [{ // Today's stats query - this is what we're testing
        tasks_completed: 3,
        total_tasks: 5,
        focus_minutes: 0,
        ai_interactions: 0,
        goals_achieved: 0,
        productivity_score: 0
      }] })
      .mockResolvedValueOnce({ rows: [] }) // Today's tasks
      .mockResolvedValueOnce({ rows: [] }) // Active goals
      .mockResolvedValueOnce({ rows: [] }) // Conversations
      .mockResolvedValueOnce({ rows: [] }) // Achievements
      .mockResolvedValueOnce({ rows: [{ // Weekly focus
        total_minutes: 0,
        sessions_count: 0,
        average_session: 0
      }] })

    const request = new NextRequest('http://localhost:3000/api/dashboard')
    const response = await GET(request)
    const data = await response.json()

    // Verify the query uses completed_at field correctly
    const todaysStatsQuery = mockClient.query.mock.calls[1][0]
    
    // Check that the query uses completed_at instead of updated_at
    expect(todaysStatsQuery).toContain('completed_at IS NOT NULL')
    expect(todaysStatsQuery).toContain('completed_at >= CURRENT_DATE AND completed_at < CURRENT_DATE + INTERVAL \'1 day\'')
    
    // Ensure it doesn't use the old buggy approach
    expect(todaysStatsQuery).not.toContain('DATE(updated_at) = CURRENT_DATE')

    // Verify the response structure
    expect(response.status).toBe(200)
    expect(data.todaysStats.tasks_completed).toBe(3)
    expect(data.todaysStats.total_tasks).toBe(5)
  })

  it('should handle timezone-aware date filtering for completed tasks', async () => {
    const mockUser = { id: 'user-123' }
    authenticateRequest.mockResolvedValue({ user: mockUser, error: null })

    const mockClient = {
      query: jest.fn()
    }
    createClient.mockResolvedValue(mockClient)

    // Mock the database responses for minimal test
    mockClient.query
      .mockResolvedValueOnce({ rows: [{ id: 'user-123', email: 'test@example.com' }] })
      .mockResolvedValueOnce({ rows: [{ tasks_completed: 2, total_tasks: 4, focus_minutes: 0, ai_interactions: 0, goals_achieved: 0, productivity_score: 0 }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ total_minutes: 0, sessions_count: 0, average_session: 0 }] })

    const request = new NextRequest('http://localhost:3000/api/dashboard')
    await GET(request)

    const todaysStatsQuery = mockClient.query.mock.calls[1][0]
    
    // Verify proper timezone-aware filtering using INTERVAL
    expect(todaysStatsQuery).toContain('CURRENT_DATE + INTERVAL \'1 day\'')
    expect(todaysStatsQuery).toContain('completed_at >= CURRENT_DATE')
    
    // Ensure it uses the status = 'completed' condition with completed_at check
    expect(todaysStatsQuery).toContain('status = \'completed\' AND completed_at IS NOT NULL')
  })

  it('should return 401 when user is not authenticated', async () => {
    authenticateRequest.mockResolvedValue({ user: null, error: 'Unauthorized' })

    const request = new NextRequest('http://localhost:3000/api/dashboard')
    const response = await GET(request)

    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data.error).toBe('Unauthorized')
  })
})