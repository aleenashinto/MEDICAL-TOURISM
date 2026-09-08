/**
 * Vitalis Centralized Logger & Operational Observability Module
 */

export interface LogDetails {
  context?: string;
  userEmail?: string;
  metadata?: Record<string, any>;
}

export class Logger {
  static info(message: string, details?: LogDetails) {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({ level: 'INFO', timestamp, message, ...details }));
  }

  static warn(message: string, details?: LogDetails) {
    const timestamp = new Date().toISOString();
    console.warn(JSON.stringify({ level: 'WARN', timestamp, message, ...details }));
  }

  static error(message: string, error?: any, details?: LogDetails) {
    const timestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : String(error || '');
    const stack = error instanceof Error ? error.stack : undefined;
    console.error(JSON.stringify({ level: 'ERROR', timestamp, message, errorMessage, stack, ...details }));
  }
}
