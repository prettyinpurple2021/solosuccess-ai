import { createClient } from "@/lib/neon/server"

export interface TrainingInteraction {
  id: string
  userId: string
  agentId: string
  timestamp: Date
  userMessage: string
  agentResponse: string
  context: Record<string, unknown>
  userRating?: number
  userFeedback?: string
  success: boolean
  responseTime: number
  confidence: number
  collaborationRequests: string[]
  followUpTasks: string[]
  metadata: {
    model: string
    temperature: number
    maxOutputTokens: number
    framework: string
    specialization: string
  }
}

export interface TrainingMetrics {
  totalInteractions: number
  averageRating: number
  successRate: number
  averageResponseTime: number
  averageConfidence: number
  topPerformingAgents: Array<{
    agentId: string
    successRate: number
    averageRating: number
    totalInteractions: number
  }>
  commonFailurePatterns: Array<{
    pattern: string
    frequency: number
    agents: string[]
  }>
  userSatisfactionTrends: Array<{
    date: string
    averageRating: number
    totalInteractions: number
  }>
}

export class TrainingDataCollector {
  private async getDb() {
    const pool = await createClient()
    return pool
  }

  async recordInteraction(interaction: Omit<TrainingInteraction, 'id' | 'timestamp'>): Promise<string> {
    const id = crypto.randomUUID()
    const timestamp = new Date()

    try {
      const db = await this.getDb()
      await db.query(`
        INSERT INTO agent_training_interactions (
          id, user_id, agent_id, timestamp, user_message, agent_response,
          context, user_rating, user_feedback, success, response_time,
          confidence, collaboration_requests, follow_up_tasks, metadata
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
        )
      `, [
        id,
        interaction.userId,
        interaction.agentId,
        timestamp,
        interaction.userMessage,
        interaction.agentResponse,
        JSON.stringify(interaction.context),
        interaction.userRating || null,
        interaction.userFeedback || null,
        interaction.success,
        interaction.responseTime,
        interaction.confidence,
        JSON.stringify(interaction.collaborationRequests),
        JSON.stringify(interaction.followUpTasks),
        JSON.stringify(interaction.metadata)
      ])

      return id
    } catch (error) {
      console.error('Error recording training interaction:', error)
      throw new Error('Failed to record training interaction')
    }
  }

  async updateInteractionRating(interactionId: string, rating: number, feedback?: string): Promise<void> {
    try {
      const db = await this.getDb()
      await db.query(`
        UPDATE agent_training_interactions 
        SET user_rating = $1, user_feedback = $2, updated_at = NOW()
        WHERE id = $3
      `, [rating, feedback || null, interactionId])
    } catch (error) {
      console.error('Error updating interaction rating:', error)
      throw new Error('Failed to update interaction rating')
    }
  }

  async getTrainingMetrics(userId: string, timeRange?: { start: Date; end: Date }): Promise<TrainingMetrics> {
    try {
      const db = await this.getDb()
      const timeFilter = timeRange 
        ? `AND timestamp BETWEEN $2 AND $3`
        : ''
      
      const params = timeRange ? [userId, timeRange.start, timeRange.end] : [userId]

      // Get total interactions
      const totalResult = await db.query(`
        SELECT COUNT(*) as total
        FROM agent_training_interactions 
        WHERE user_id = $1 ${timeFilter}
      `, params)

      // Get average rating
      const ratingResult = await db.query(`
        SELECT AVG(user_rating) as avg_rating
        FROM agent_training_interactions 
        WHERE user_id = $1 AND user_rating IS NOT NULL ${timeFilter}
      `, params)

      // Get success rate
      const successResult = await db.query(`
        SELECT 
          COUNT(*) FILTER (WHERE success = true) as successful,
          COUNT(*) as total
        FROM agent_training_interactions 
        WHERE user_id = $1 ${timeFilter}
      `, params)

      // Get average response time
      const responseTimeResult = await db.query(`
        SELECT AVG(response_time) as avg_response_time
        FROM agent_training_interactions 
        WHERE user_id = $1 ${timeFilter}
      `, params)

      // Get average confidence
      const confidenceResult = await db.query(`
        SELECT AVG(confidence) as avg_confidence
        FROM agent_training_interactions 
        WHERE user_id = $1 ${timeFilter}
      `, params)

      // Get top performing agents
      const topAgentsResult = await db.query(`
        SELECT 
          agent_id,
          COUNT(*) as total_interactions,
          AVG(user_rating) as avg_rating,
          COUNT(*) FILTER (WHERE success = true)::float / COUNT(*) as success_rate
        FROM agent_training_interactions 
        WHERE user_id = $1 ${timeFilter}
        GROUP BY agent_id
        ORDER BY success_rate DESC, avg_rating DESC
        LIMIT 5
      `, params)

      // Get user satisfaction trends (last 30 days)
      const trendsResult = await db.query(`
        SELECT 
          DATE(timestamp) as date,
          AVG(user_rating) as avg_rating,
          COUNT(*) as total_interactions
        FROM agent_training_interactions 
        WHERE user_id = $1 
          AND timestamp >= NOW() - INTERVAL '30 days'
          AND user_rating IS NOT NULL
        GROUP BY DATE(timestamp)
        ORDER BY date DESC
      `, [userId])

      const total = parseInt(totalResult.rows[0]?.total || '0')
      const avgRating = parseFloat(ratingResult.rows[0]?.avg_rating || '0')
      const successData = successResult.rows[0]
      const successRate = successData ? 
        (parseInt(successData.successful || '0') / parseInt(successData.total || '1')) * 100 : 0
      const avgResponseTime = parseFloat(responseTimeResult.rows[0]?.avg_response_time || '0')
      const avgConfidence = parseFloat(confidenceResult.rows[0]?.avg_confidence || '0')

      return {
        totalInteractions: total,
        averageRating: avgRating,
        successRate,
        averageResponseTime: avgResponseTime,
        averageConfidence: avgConfidence,
        topPerformingAgents: topAgentsResult.rows.map(row => ({
          agentId: row.agent_id,
          successRate: parseFloat(row.success_rate || '0') * 100,
          averageRating: parseFloat(row.avg_rating || '0'),
          totalInteractions: parseInt(row.total_interactions || '0')
        })),
        commonFailurePatterns: [], // TODO: Implement pattern analysis
        userSatisfactionTrends: trendsResult.rows.map(row => ({
          date: row.date,
          averageRating: parseFloat(row.avg_rating || '0'),
          totalInteractions: parseInt(row.total_interactions || '0')
        }))
      }
    } catch (error) {
      console.error('Error getting training metrics:', error)
      throw new Error('Failed to get training metrics')
    }
  }

  async getTrainingDataForAgent(agentId: string, userId: string, limit = 1000): Promise<TrainingInteraction[]> {
    try {
      const db = await this.getDb()
      const result = await db.query(`
        SELECT *
        FROM agent_training_interactions 
        WHERE agent_id = $1 AND user_id = $2
        ORDER BY timestamp DESC
        LIMIT $3
      `, [agentId, userId, limit])

      return result.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        agentId: row.agent_id,
        timestamp: new Date(row.timestamp),
        userMessage: row.user_message,
        agentResponse: row.agent_response,
        context: JSON.parse(row.context || '{}'),
        userRating: row.user_rating,
        userFeedback: row.user_feedback,
        success: row.success,
        responseTime: row.response_time,
        confidence: row.confidence,
        collaborationRequests: JSON.parse(row.collaboration_requests || '[]'),
        followUpTasks: JSON.parse(row.follow_up_tasks || '[]'),
        metadata: JSON.parse(row.metadata || '{}')
      }))
    } catch (error) {
      console.error('Error getting training data for agent:', error)
      throw new Error('Failed to get training data for agent')
    }
  }

  async exportTrainingData(userId: string, format: 'json' | 'csv' = 'json'): Promise<string> {
    try {
      const db = await this.getDb()
      const result = await db.query(`
        SELECT *
        FROM agent_training_interactions 
        WHERE user_id = $1
        ORDER BY timestamp DESC
      `, [userId])

      const data = result.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        agentId: row.agent_id,
        timestamp: row.timestamp,
        userMessage: row.user_message,
        agentResponse: row.agent_response,
        context: JSON.parse(row.context || '{}'),
        userRating: row.user_rating,
        userFeedback: row.user_feedback,
        success: row.success,
        responseTime: row.response_time,
        confidence: row.confidence,
        collaborationRequests: JSON.parse(row.collaboration_requests || '[]'),
        followUpTasks: JSON.parse(row.follow_up_tasks || '[]'),
        metadata: JSON.parse(row.metadata || '{}')
      }))

      if (format === 'csv') {
        // Convert to CSV format
        const headers = Object.keys(data[0] || {})
        const csvRows = [
          headers.join(','),
          ...data.map(row => 
            headers.map(header => {
              const value = row[header as keyof typeof row]
              return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
            }).join(',')
          )
        ]
        return csvRows.join('\n')
      }

      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('Error exporting training data:', error)
      throw new Error('Failed to export training data')
    }
  }
}
