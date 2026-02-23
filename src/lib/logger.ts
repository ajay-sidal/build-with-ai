export type LogMeta = Record<string, unknown>

function formatRecord(level: 'info' | 'warn' | 'error', message: string, meta?: LogMeta) {
  const record = {
    ts: new Date().toISOString(),
    level,
    message,
    ...(meta || {}),
  }
  try {
    return JSON.stringify(record)
  } catch {
    return `${record.ts} ${level.toUpperCase()} ${message}`
  }
}

export const logger = {
  info: (message: string, meta?: LogMeta) => console.info(formatRecord('info', message, meta)),
  warn: (message: string, meta?: LogMeta) => console.warn(formatRecord('warn', message, meta)),
  error: (message: string, meta?: LogMeta) => console.error(formatRecord('error', message, meta)),
}

export default logger
