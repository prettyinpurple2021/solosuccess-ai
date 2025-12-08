type LogContext = Record<string, unknown>

function formatContext(context?: LogContext) {
  return context && Object.keys(context).length > 0 ? ` | context=${JSON.stringify(context)}` : ''
}

export function logInfo(message: string, context?: LogContext) {
  if (process.env.NODE_ENV === 'development') {
    console.info(`[info] ${message}${formatContext(context)}`)
  }
}

export function logWarn(message: string, context?: LogContext) {
  if (process.env.NODE_ENV !== 'test') {
    console.warn(`[warn] ${message}${formatContext(context)}`)
  }
}

export function logError(message: string, error?: unknown, context?: LogContext) {
  const errMsg =
    error instanceof Error
      ? ` | error=${error.message} | stack=${process.env.NODE_ENV === 'development' ? error.stack : ''}`
      : error
      ? ` | error=${String(error)}`
      : ''
  console.error(`[error] ${message}${errMsg}${formatContext(context)}`)
}

