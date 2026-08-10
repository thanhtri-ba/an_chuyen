import { createLogger, format, transports } from 'winston';
import { getRequestContext } from './async-context';
import { redactFormat } from './redaction';

const { combine, timestamp, printf, colorize, json } = format;

// Inject AsyncContext variables into the log info
const injectContext = format((info) => {
  const context = getRequestContext();
  if (context) {
    info.requestId = context.requestId;
    info.correlationId = context.correlationId;
  }
  return info;
});

// Human-readable format for development
const devFormat = combine(
  colorize(),
  timestamp(),
  injectContext(),
  redactFormat(),
  printf(({ timestamp, level, message, requestId, correlationId, ...meta }) => {
    const reqIdStr = requestId ? ` [ReqID: ${requestId}]` : '';
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} ${level}${reqIdStr}: ${message}${metaStr}`;
  })
);

// Structured JSON format for production
const prodFormat = combine(
  timestamp(),
  injectContext(),
  redactFormat(),
  json()
);

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  transports: [
    new transports.Console()
  ],
});