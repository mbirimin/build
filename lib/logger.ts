import fs from "fs/promises"
import path from "path"

const LOG_DIR = path.join(process.cwd(), "logs")
const LOG_FILE = path.join(LOG_DIR, "app.log")
const ERROR_LOG_FILE = path.join(LOG_DIR, "error.log")

type LogLevel = "info" | "warn" | "error" | "debug"

class Logger {
  private logLevel: LogLevel

  constructor() {
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || "info"
    this.ensureLogDir()
  }

  private async ensureLogDir() {
    try {
      await fs.mkdir(LOG_DIR, { recursive: true })
    } catch (error) {
      console.error("Failed to create log directory:", error)
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 }
    return levels[level] >= levels[this.logLevel]
  }

  private async writeLog(level: LogLevel, message: string, data?: any) {
    if (!this.shouldLog(level)) return

    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...(data && { data }),
    }

    const logLine = JSON.stringify(logEntry) + "\n"

    try {
      // Write to main log
      await fs.appendFile(LOG_FILE, logLine)

      // Write errors to separate error log
      if (level === "error") {
        await fs.appendFile(ERROR_LOG_FILE, logLine)
      }
    } catch (error) {
      console.error("Failed to write log:", error)
    }

    // Also log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, data || "")
    }
  }

  info(message: string, data?: any) {
    this.writeLog("info", message, data)
  }

  warn(message: string, data?: any) {
    this.writeLog("warn", message, data)
  }

  error(message: string, data?: any) {
    this.writeLog("error", message, data)
  }

  debug(message: string, data?: any) {
    this.writeLog("debug", message, data)
  }
}

export const logger = new Logger()
