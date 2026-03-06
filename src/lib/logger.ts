/**
 * Centralized logging utility for consistent error reporting.
 *
 * Provides structured logging with context, enabling easier debugging
 * and future integration with error monitoring services.
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogEntry {
  level: LogLevel
  context: string
  message: string
  data?: unknown
  timestamp: number
}

const formatLogEntry = (entry: LogEntry): string => {
  return `[${entry.context}] ${entry.message}`
}

class Logger {
  private context: string

  constructor(context: string) {
    this.context = context
  }

  private createEntry(
    level: LogLevel,
    message: string,
    data?: unknown
  ): LogEntry {
    return {
      level,
      context: this.context,
      message,
      data,
      timestamp: Date.now(),
    }
  }

  debug(message: string, data?: unknown) {
    const entry = this.createEntry(LogLevel.DEBUG, message, data)
    console.debug(formatLogEntry(entry), data ?? '')
  }

  info(message: string, data?: unknown) {
    const entry = this.createEntry(LogLevel.INFO, message, data)
    console.info(formatLogEntry(entry), data ?? '')
  }

  warn(message: string, data?: unknown) {
    const entry = this.createEntry(LogLevel.WARN, message, data)
    console.warn(formatLogEntry(entry), data ?? '')
  }

  error(message: string, data?: unknown) {
    const entry = this.createEntry(LogLevel.ERROR, message, data)
    console.error(formatLogEntry(entry), data ?? '')
  }
}

/**
 * Creates a logger instance scoped to a specific module/component context.
 *
 * @example
 * const logger = createLogger('PeerRoom')
 * logger.error('Failed to connect', error)
 * // Output: [PeerRoom] Failed to connect <error details>
 */
export const createLogger = (context: string): Logger => {
  return new Logger(context)
}
