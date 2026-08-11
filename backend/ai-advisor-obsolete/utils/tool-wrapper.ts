import { PrismaClient } from '@prisma/client';
import { logger } from '../../../core/logger';

const prisma = new PrismaClient();

interface ToolWrapperOptions {
  toolName: string;
  allowedInputKeys: string[];
  summarizeOutput: (output: any) => any;
}

export function wrapToolExecute(
  originalExecute: (input: any, context?: any) => Promise<any>,
  options: ToolWrapperOptions
) {
  return async (input: any, context?: any) => {
    const startTime = Date.now();
    const requestContext = context?.requestContext;
    const conversationId = requestContext?.get('conversationId');
    const traceId = requestContext?.get('traceId');

    // Redact Input based on allowlist
    const inputSummary: Record<string, any> = {};
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
            inputSummary: inputSummary as any,
            outputSummary: options.summarizeOutput(result),
            status: 'SUCCESS',
            executionTimeMs,
            traceId,
          },
        }).catch((err) => {
          logger.error(`[AI-Advisor] Failed to save tool log for ${options.toolName}: ${err.message}`);
        });
      }

      return result;
    } catch (error) {
      const executionTimeMs = Date.now() - startTime;
      const errorCode = (error as Error).name || 'UNKNOWN_ERROR';

      if (conversationId) {
        prisma.aiToolLog.create({
          data: {
            conversationId,
            toolName: options.toolName,
            inputSummary: inputSummary as any,
            outputSummary: { error: (error as Error).message },
            status: 'FAILED',
            executionTimeMs,
            errorCode,
            traceId,
          },
        }).catch((err) => {
          logger.error(`[AI-Advisor] Failed to save error tool log for ${options.toolName}: ${err.message}`);
        });
      }

      throw error;
    }
  };
}
