"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapToolExecute = wrapToolExecute;
const client_1 = require("@prisma/client");
const logger_1 = require("../../../core/logger");
const prisma = new client_1.PrismaClient();
function wrapToolExecute(originalExecute, options) {
    return async (input, context) => {
        const startTime = Date.now();
        const requestContext = context?.requestContext;
        const conversationId = requestContext?.get('conversationId');
        const traceId = requestContext?.get('traceId');
        // Redact Input based on allowlist
        const inputSummary = {};
        if (input && typeof input === 'object') {
            for (const key of options.allowedInputKeys) {
                if (key in input) {
                    inputSummary[key] = input[key];
                }
            }
        }
        try {
            const result = await originalExecute(input, context);
            const executionTimeMs = Date.now() - startTime;
            if (conversationId) {
                // Run database logging asynchronously to prevent blocking the tool execution
                prisma.aiToolLog.create({
                    data: {
                        conversationId,
                        toolName: options.toolName,
                        inputSummary: inputSummary,
                        outputSummary: options.summarizeOutput(result),
                        status: 'SUCCESS',
                        executionTimeMs,
                        traceId,
                    },
                }).catch((err) => {
                    logger_1.logger.error(`[AI-Advisor] Failed to save tool log for ${options.toolName}: ${err.message}`);
                });
            }
            return result;
        }
        catch (error) {
            const executionTimeMs = Date.now() - startTime;
            const errorCode = error.name || 'UNKNOWN_ERROR';
            if (conversationId) {
                prisma.aiToolLog.create({
                    data: {
                        conversationId,
                        toolName: options.toolName,
                        inputSummary: inputSummary,
                        outputSummary: { error: error.message },
                        status: 'FAILED',
                        executionTimeMs,
                        errorCode,
                        traceId,
                    },
                }).catch((err) => {
                    logger_1.logger.error(`[AI-Advisor] Failed to save error tool log for ${options.toolName}: ${err.message}`);
                });
            }
            throw error;
        }
    };
}
