/* eslint-disable @typescript-eslint/no-unused-vars */
import { LambdaLogger } from '@core';

export class LoggerFake implements LambdaLogger {
  maskSecret(secret: string): void {
    // Do nothing
  }
  log(message: string, data: object, className?: string | undefined, correlationObject?: object | undefined): void {
    // Do nothing
  }
  fatal(message: string, data: object, className?: string | undefined, correlationObject?: object | undefined): void {
    // Do nothing
  }
  error(message: string, data: object, className?: string | undefined, correlationObject?: object | undefined): void {
    // Do nothing
  }
  warn(message: string, data: object, className?: string | undefined, correlationObject?: object | undefined): void {
    // Do nothing
  }
  info(message: string, data: object, className?: string | undefined, correlationObject?: object | undefined): void {
    // Do nothing
  }
  debug(message: string, data: object, className?: string | undefined, correlationObject?: object | undefined): void {
    // Do nothing
  }
  trace(message: string, data: object, className?: string | undefined, correlationObject?: object | undefined): void {
    // Do nothing
  }
}
