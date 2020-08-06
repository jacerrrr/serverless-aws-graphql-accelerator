import { Environment } from '@environment';

import { LoggerInterface } from './logger';

type Data = Error | string | { [key: string]: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
type LogLevel = 'info' | 'fatal' | 'error' | 'warn' | 'debug' | 'trace';

export class AppLogger implements LoggerInterface {
  private _output: Function;
  private readonly logLevels: { [key: string]: number };
  private readonly configSecrets: Array<string>;

  constructor(private readonly env: Environment) {
    // eslint-disable-next-line no-console
    this._output = console.log;

    // Log levels standard defined by Log4j
    this.logLevels = {
      off: 0,
      fatal: 100,
      error: 200,
      warn: 300,
      info: 400,
      debug: 500,
      trace: 600,
      all: 10000,
    };
    this.configSecrets = [];
  }

  // The log() function is an alias to allow our Logger class to be used as a logger for AWS sdk calls
  log(message: string, data: Data, className: string): void {
    this.writeLog('info', message, data, className);
  }
  fatal(message: string, data: Data, className: string): void {
    this.writeLog('fatal', message, data, className);
  }
  error(message: string, data: Data, className: string): void {
    this.writeLog('error', message, data, className);
  }
  warn(message: string, data: Data, className: string): void {
    this.writeLog('warn', message, data, className);
  }
  info(message: string, data: Data, className: string): void {
    this.writeLog('info', message, data, className);
  }
  debug(message: string, data: Data, className: string): void {
    this.writeLog('debug', message, data, className);
  }
  trace(message: string, data: Data, className: string): void {
    this.writeLog('trace', message, data, className);
  }

  maskSecret(secret: string): void {
    this.configSecrets.push(secret);
  }

  writeLog(level: LogLevel, message: string, data: Data, className: string): void {
    if (this.logLevels[level] <= this.logLevels[this.env.logLevel]) {
      let dataOutput = data !== undefined ? data : {};
      if (dataOutput instanceof Error) {
        // Improved serialization for Error objects
        dataOutput = 'Error message: ' + dataOutput.message + '; Stack: ' + dataOutput.stack;
      } else {
        try {
          // JSON.stringify data objects
          dataOutput = JSON.stringify(dataOutput);
        } catch (jsonError) {
          // squealch stringify errors so that we can output the original log message
          dataOutput = 'Unable to serialize error data';
        }
      }

      // Project-specific convention for Error output structure
      const outObject = {
        level: level,
        message: message,
        data: dataOutput,
        timestamp: new Date().toISOString(),
        location: className,
      };

      let outString: string;
      try {
        outString = JSON.stringify(outObject);
      } catch (err) {
        outString = `{"level":"error","message":"Error trying to serialize for logs; ${err}"}`;
      }

      // Mask secrets from being written to the logs
      this.configSecrets.forEach(secret => {
        outString = outString && outString.replace(secret, '*****');
      });

      this._output(outString);
    }
  }
}
