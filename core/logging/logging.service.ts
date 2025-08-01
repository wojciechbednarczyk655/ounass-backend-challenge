import { Injectable, ConsoleLogger } from '@nestjs/common';

const LOG_LEVELS = ['error', 'warn', 'log', 'info', 'debug'] as const;
type TLogLevel = (typeof LOG_LEVELS)[number];

@Injectable()
export class LoggingService extends ConsoleLogger {
  private readonly logLevel: TLogLevel;

  constructor(context: string = 'App') {
    super(context);
    this.logLevel = (process.env.LOG_LEVEL as TLogLevel) || 'log';
  }

  private shouldLog(level: TLogLevel): boolean {
    return LOG_LEVELS.indexOf(level) <= LOG_LEVELS.indexOf(this.logLevel);
  }

  log(message?: string, context?: string): void {
    if (!message) {
      console.trace('logger.log called with undefined or empty message');
      return;
    }
    if (this.shouldLog('log')) super.log(this.format(message), context);
  }

  info(message: string, context?: string): void {
    if (this.shouldLog('info')) this.log(message, context);
  }

  warn(message: string, context?: string): void {
    if (this.shouldLog('warn')) super.warn(this.format(message), context);
  }

  error(message: string, trace?: string, context?: string): void {
    if (this.shouldLog('error'))
      super.error(this.format(message), trace, context);
  }

  debug(message: string, context?: string): void {
    if (this.shouldLog('debug')) super.debug(this.format(message), context);
  }

  setContext(context: string) {
    this.context = context;
  }

  private format(message: string): string {
    const base = {
      timestamp: new Date().toISOString(),
      context: this.context,
      message: message ?? '',
    };
    return JSON.stringify(base);
  }
}
