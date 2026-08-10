import { RequestContext } from '@mastra/core/request-context';
import { travelAdvisorAgent } from '../agents/travel-advisor.agent';
import { z } from 'zod';
import { prisma } from '../../../core/prisma';
import { logger } from '../../../core/logger';
import { randomUUID } from 'crypto';

export const travelAdvisorOutputSchema = z.object({
  message: z.string().describe('Câu trả lời phản hồi thân thiện bằng tiếng Việt.'),
  intent: z.string().describe('Ý định của người dùng (ví dụ: chào hỏi, tìm chuyến xe, hỏi chính sách, hỏi lịch sử đặt vé, câu hỏi ngoài luồng...)'),
  missingFields: z.array(z.string()).describe('Danh sách thông tin còn thiếu (ví dụ: departureCity, arrivalCity, departureDate)'),
  recommendations: z.array(
    z.object({
      tripScheduleId: z.string().describe('ID lịch trình chuyến xe.'),
      departureTime: z.string().describe('Thời gian khởi hành.'),
      arrivalTime: z.string().describe('Thời gian đến dự kiến.'),
      busAgentName: z.string().describe('Tên nhà xe.'),
      price: z.number().describe('Giá vé.'),
      availableSeats: z.number().describe('Số ghế còn trống.'),
      score: z.number().describe('Điểm số đề xuất (0-100).'),
      reasons: z.array(z.string()).describe('Các lý do đề xuất (ví dụ: Giờ đi đẹp, Giá rẻ, Tránh kẹt xe...).'),
    })
  ).describe('Danh sách các chuyến xe được đề xuất, tối đa 3 chuyến.'),
  warnings: z.array(z.string()).describe('Cảnh báo liên quan (ví dụ: Thời điểm đi dễ kẹt xe...).'),
  requiresConfirmation: z.boolean().describe('Luôn bằng true nếu cuộc hội thoại hướng tới bước đặt vé.'),
});

export const aiAdvisorResponseSchema = travelAdvisorOutputSchema.extend({
  reply: z.string(),
  conversationId: z.string().nullable(),
  messageId: z.string().nullable(),
  feedbackEnabled: z.boolean(),
  fallback: z.boolean(),
});

export type TravelAdvisorOutput = z.infer<typeof travelAdvisorOutputSchema>;
export type AiAdvisorResponse = z.infer<typeof aiAdvisorResponseSchema>;

export interface AskTravelAdvisorInput {
  message: string;
  userId: string; // userId is required (JWT enforced)
  conversationId?: string;
  traceId?: string;
}

export async function askTravelAdvisor(
  input: AskTravelAdvisorInput,
): Promise<AiAdvisorResponse> {
  const timeoutMs = parseInt(process.env.AI_REQUEST_TIMEOUT_MS || '30000', 10);
  const traceId = input.traceId || randomUUID();
  const requestContext = new RequestContext();

  requestContext.set('userId', input.userId);
  requestContext.set('traceId', traceId);

  let conversationId: string | null = null;
  let assistantMessageId: string | null = null;
  let dbSavingFailed = false;

  // Step 1: Initialize conversation and save user message inside try-catch to keep it secondary
  try {
    if (input.conversationId) {
      conversationId = input.conversationId;
    } else {
      const conv = await prisma.aiConversation.create({
        data: { userId: input.userId },
      });
      conversationId = conv.id;
    }

    await prisma.aiMessage.create({
      data: {
        conversationId: conversationId,
        role: 'USER',
        content: input.message,
        traceId,
      },
    });

    requestContext.set('conversationId', conversationId);
  } catch (dbError) {
    logger.error(`[AI-Advisor] [${traceId}] Database user message logging failed: ${(dbError as Error).message}`);
    dbSavingFailed = true;
  }

  // Step 2: Query AI model with timeout
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('AI request timeout')), timeoutMs)
  );

  const agentPromise = (async () => {
    const result = await travelAdvisorAgent.generate(
      [
        {
          role: 'user',
          content: input.message,
        },
      ],
      {
        requestContext,
        structuredOutput: {
          schema: travelAdvisorOutputSchema,
        },
      }
    );

    if (result.object) {
      return result.object as TravelAdvisorOutput;
    }
    throw new Error('AI response did not match structured schema');
  })();

  let agentOutput: TravelAdvisorOutput;
  let isFallback = false;

  try {
    agentOutput = await Promise.race([agentPromise, timeoutPromise]);
  } catch (error) {
    logger.error(`[AI-Advisor] [${traceId}] AI generation error: ${(error as Error).message}`);
    isFallback = true;
    agentOutput = {
      message: 'Xin lỗi bạn, trợ lý AI của An Chuyến hiện đang bận hoặc gặp sự cố kết nối. Bạn có thể liên hệ hotline 1900 6789 hoặc thử lại sau ít phút nhé!',
      intent: 'fallback_error',
      missingFields: [],
      recommendations: [],
      warnings: ['Hệ thống AI gặp sự cố kết nối.'],
      requiresConfirmation: false,
    };
  }

  // Step 3: Log assistant response to database
  if (conversationId && !dbSavingFailed && !isFallback) {
    try {
      const savedMsg = await prisma.aiMessage.create({
        data: {
          conversationId: conversationId,
          role: 'ASSISTANT',
          content: agentOutput.message,
          traceId,
        },
      });
      assistantMessageId = savedMsg.id;
    } catch (dbError) {
      logger.error(`[AI-Advisor] [${traceId}] Database assistant message logging failed: ${(dbError as Error).message}`);
      dbSavingFailed = true;
    }
  }

  // Step 4: Construct dynamic response aligning with schema specifications
  return {
    ...agentOutput,
    reply: agentOutput.message,
    conversationId: dbSavingFailed ? null : conversationId,
    messageId: dbSavingFailed || isFallback ? null : assistantMessageId,
    feedbackEnabled: !dbSavingFailed && !isFallback,
    fallback: isFallback,
  };
}
