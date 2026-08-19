"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const async_context_1 = require("./async-context");
const redaction_1 = require("./redaction");
const { combine, timestamp, printf, colorize, json } = winston_1.format;
// Inject AsyncContext variables into the log info
const injectContext = (0, winston_1.format)((info) => {
    const context = (0, async_context_1.getRequestContext)();
    if (context) {
        info.requestId = context.requestId;
        info.correlationId = context.correlationId;
    }
    return info;
});
// Human-readable format for development
const devFormat = combine(colorize(), timestamp(), injectContext(), (0, redaction_1.redactFormat)(), printf(({ timestamp, level, message, requestId, correlationId, ...meta }) => {
    const reqIdStr = requestId ? ` [ReqID: ${requestId}]` : '';
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} ${level}${reqIdStr}: ${message}${metaStr}`;
}));
// Structured JSON format for production
const prodFormat = combine(timestamp(), injectContext(), (0, redaction_1.redactFormat)(), json());
exports.logger = (0, winston_1.createLogger)({
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
    transports: [
        new winston_1.transports.Console()
    ],
});
