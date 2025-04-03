import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

const logDir = 'logs';
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

export const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    myFormat,
  ),
  transports: [
    new transports.DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new transports.DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
  exitOnError: false,
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(format.colorize(), myFormat),
    }),
  );
}
