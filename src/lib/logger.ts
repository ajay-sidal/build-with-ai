/**
 * Enterprise-grade structured logging with Winston
 * Supports multiple log levels, JSON formatting, and transport configuration
 */

import winston from 'winston'

export type LogMeta = Record<string, unknown>

// Define log levels
const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
  },
}

// Add colors to winston
winston.addColors(logLevels.colors)

// Determine log format based on environment
const isDevelopment = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'

// Custom format for development (readable)
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta, null, 2)}` : ''
    return `${timestamp} [${level}]: ${message}${metaString}`
  })
)

// JSON format for production (structured logging)
const prodFormat = winston.format.combine(
  winston.format.timestamp({ format: 'ISO8601' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  levels: logLevels.levels,
  // Don't log in test environment unless explicitly enabled
  silent: isTest && !process.env.LOG_LEVEL,
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: isDevelopment ? devFormat : prodFormat,
    }),
  ],
  defaultMeta: {
    service: 'build-with-ai',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || 'unknown',
  },
})

// Add file transport in production if LOG_FILE is specified
if (process.env.LOG_FILE && !isDevelopment) {
  logger.add(
    new winston.transports.File({
      filename: process.env.LOG_FILE,
      format: prodFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  )
}

// Create child loggers for different contexts
export function createLogger(context: string) {
  return logger.child({ context })
}

// HTTP request logging middleware helper
export function httpLogger(req: any, res: any, next: any) {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    logger.http('HTTP request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      userAgent: req.headers['user-agent'],
    })
  })

  next()
}

// Error logging helper with context
export function logError(error: Error, context: LogMeta = {}) {
  logger.error(error.message, {
    ...context,
    stack: error.stack,
    name: error.name,
  })
}

// Request context logger
export function requestLogger(requestId: string) {
  return createLogger(`request:${requestId}`)
}

// Export the main logger and utilities
export { logger }
export default {
  logger,
  createLogger,
  httpLogger,
  logError,
  requestLogger,
}
