export interface LoggerInterface {
  maskSecret(secret: string): void;
  log(message: string, data: object, className?: string, correlationObject?: object): void;
  fatal(message: string, data: object, className?: string, correlationObject?: object): void;
  error(message: string, data: object, className?: string, correlationObject?: object): void;
  warn(message: string, data: object, className?: string, correlationObject?: object): void;
  info(message: string, data: object, className?: string, correlationObject?: object): void;
  debug(message: string, data: object, className?: string, correlationObject?: object): void;
  trace(message: string, data: object, className?: string, correlationObject?: object): void;
}
