/**
 * Unified Logging System
 * Provides structured, environment-aware logging with multiple output destinations
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
  error?: Error;
}

export type LogOutput = (entry: LogEntry) => void;

export class Logger {
  private static instance: Logger;
  private level: LogLevel;
  private outputs: LogOutput[] = [];
  private isDevelopment: boolean;

  private constructor() {
    // Check if we're in development mode
    // @ts-ignore - import.meta.env is available in Vite but TypeScript doesn't recognize it
    this.isDevelopment = (typeof import.meta !== 'undefined' && import.meta.env?.DEV) || 
                         (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development');
    this.level = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
    
    // Default console output
    this.addOutput(this.consoleOutput);
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Set minimum log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Get current log level
   */
  getLevel(): LogLevel {
    return this.level;
  }

  /**
   * Add a custom output destination
   */
  addOutput(output: LogOutput): void {
    this.outputs.push(output);
  }

  /**
   * Remove an output destination
   */
  removeOutput(output: LogOutput): void {
    const index = this.outputs.indexOf(output);
    if (index > -1) {
      this.outputs.splice(index, 1);
    }
  }

  /**
   * Log a debug message
   */
  debug(category: string, message: string, data?: any): void {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  /**
   * Log an info message
   */
  info(category: string, message: string, data?: any): void {
    this.log(LogLevel.INFO, category, message, data);
  }

  /**
   * Log a warning message
   */
  warn(category: string, message: string, data?: any): void {
    this.log(LogLevel.WARN, category, message, data);
  }

  /**
   * Log an error message
   */
  error(category: string, message: string, error?: Error, data?: any): void {
    this.log(LogLevel.ERROR, category, message, data, error);
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, category: string, message: string, data?: any, error?: Error): void {
    if (level < this.level) {
      return; // Skip if below minimum level
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      error
    };

    // Async logging to avoid blocking
    Promise.resolve().then(() => {
      this.outputs.forEach(output => {
        try {
          output(entry);
        } catch (err) {
          // Fallback to console if output fails
          console.error('Logger output failed:', err);
        }
      });
    });
  }

  /**
   * Default console output
   */
  private consoleOutput = (entry: LogEntry): void => {
    const levelName = LogLevel[entry.level];
    const prefix = `[${entry.timestamp}] [${levelName}] [${entry.category}]`;
    
    const style = this.getConsoleStyle(entry.level);
    const args: any[] = [`%c${prefix}`, style, entry.message];
    
    if (entry.data) {
      args.push(entry.data);
    }
    
    if (entry.error) {
      args.push(entry.error);
    }

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(...args);
        break;
      case LogLevel.INFO:
        console.info(...args);
        break;
      case LogLevel.WARN:
        console.warn(...args);
        break;
      case LogLevel.ERROR:
        console.error(...args);
        break;
    }
  };

  /**
   * Get console style for log level
   */
  private getConsoleStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: 'color: #888; font-weight: normal',
      [LogLevel.INFO]: 'color: #2196F3; font-weight: normal',
      [LogLevel.WARN]: 'color: #FF9800; font-weight: bold',
      [LogLevel.ERROR]: 'color: #F44336; font-weight: bold'
    };
    return styles[level] || '';
  }

  /**
   * Create a file output (for future use)
   */
  static createFileOutput(filePath: string): LogOutput {
    // This would require Node.js fs module
    // For browser, could use IndexedDB or send to server
    return (entry: LogEntry) => {
      // File output implementation
      // For now, this is a placeholder
    };
  }
}

/**
 * Convenience function to get logger instance
 */
export function getLogger(): Logger {
  return Logger.getInstance();
}

/**
 * Create a category-specific logger
 */
export function createCategoryLogger(category: string) {
  const logger = Logger.getInstance();
  return {
    debug: (message: string, data?: any) => logger.debug(category, message, data),
    info: (message: string, data?: any) => logger.info(category, message, data),
    warn: (message: string, data?: any) => logger.warn(category, message, data),
    error: (message: string, error?: Error, data?: any) => logger.error(category, message, error, data)
  };
}
