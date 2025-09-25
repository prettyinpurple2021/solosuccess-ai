/**
 * Production-ready logging utility for SoloSuccess AI Platform
 * Replaces console.log statements with proper logging levels
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  error?: Error
}

class Logger {
  private logLevel: LogLevel
  private isDevelopment: boolean

  constructor() {
    // Set log level based on environment
    this.isDevelopment = process.env.NODE_ENV === 'development'
    this.logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel
  }

  private formatLogEntry(entry: LogEntry): string {
    const levelNames = ['ERROR', 'WARN', 'INFO', 'DEBUG']
    const levelName = levelNames[entry.level]
    
    let logMessage = `[${entry.timestamp}] ${levelName}: ${entry.message}`
    
    if (entry.context && Object.keys(entry.context).length > 0) {
      logMessage += ` | Context: ${JSON.stringify(entry.context)}`
    }
    
    if (entry.error) {
      logMessage += ` | Error: ${entry.error.message}`
      if (this.isDevelopment && entry.error.stack) {
        logMessage += ` | Stack: ${entry.error.stack}`
      }
    }
    
    return logMessage
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    }

    const formattedMessage = this.formatLogEntry(entry)

    // Use appropriate console method based on log level
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage)
        break
      case LogLevel.WARN:
        console.warn(formattedMessage)
        break
      case LogLevel.INFO:
        console.info(formattedMessage)
        break
      case LogLevel.DEBUG:
        console.debug(formattedMessage)
        break
    }

    // In production, you might want to send logs to an external service
    // like LogRocket, or a custom logging service
    if (!this.isDevelopment && level <= LogLevel.WARN) {
      this.sendToExternalService(entry)
    }
  }

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    // This is where you would integrate with external logging services
    // For now, we'll just ensure important logs are properly formatted
    
    // Example integrations:
    // - LogRocket: LogRocket.captureException(entry.error)
    // - Custom API: fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) })
    
    try {
      // In a real implementation, you would send to your logging service here
      // For now, we'll just ensure the log is properly handled
    } catch (logError) {
      // Don't let logging errors break the application
      console.error('Failed to send log to external service:', logError)
    }
  }

  error(message: string, context?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error)
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context)
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context)
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  // Convenience method for API route logging
  apiLog(method: string, path: string, statusCode: number, duration?: number, context?: Record<string, any>): void {
    const message = `${method} ${path} - ${statusCode}${duration ? ` (${duration}ms)` : ''}`
    const level = statusCode >= 500 ? LogLevel.ERROR : statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO
    
    this.log(level, message, {
      method,
      path,
      statusCode,
      duration,
      ...context,
    })
  }

  // Convenience method for database operation logging
  dbLog(operation: string, table: string, duration?: number, context?: Record<string, any>): void {
    const message = `DB ${operation} on ${table}${duration ? ` (${duration}ms)` : ''}`
    this.log(LogLevel.DEBUG, message, {
      operation,
      table,
      duration,
      ...context,
    })
  }

  // Convenience method for authentication logging
  authLog(action: string, userId?: string, success: boolean = true, context?: Record<string, any>): void {
    const message = `Auth ${action}${userId ? ` for user ${userId}` : ''} - ${success ? 'SUCCESS' : 'FAILED'}`
    const level = success ? LogLevel.INFO : LogLevel.WARN
    
    this.log(level, message, {
      action,
      userId,
      success,
      ...context,
    })
  }
}

// Export singleton instance
export const logger = new Logger()

// Export convenience functions for common use cases
export const logError = (message: string, context?: Record<string, any>, error?: Error) => 
  logger.error(message, context, error)

export const logWarn = (message: string, context?: Record<string, any>) => 
  logger.warn(message, context)

export const logInfo = (message: string, context?: Record<string, any>) => 
  logger.info(message, context)

export const logDebug = (message: string, context?: Record<string, any>) => 
  logger.debug(message, context)

export const logApi = (method: string, path: string, statusCode: number, duration?: number, context?: Record<string, any>) => 
  logger.apiLog(method, path, statusCode, duration, context)

export const logDb = (operation: string, table: string, duration?: number, context?: Record<string, any>) => 
  logger.dbLog(operation, table, duration, context)

export const logAuth = (action: string, userId?: string, success?: boolean, context?: Record<string, any>) => 
  logger.authLog(action, userId, success, context)
