import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import NodeCache from 'node-cache';
import { randomUUID } from 'crypto';
import { prisma } from '../../core/prisma';
import { verifyAccessToken, type AuthenticatedRequest } from '../../middleware/auth.middleware';
import { askTravelAdvisor } from './services/ai-advisor.service';
import { logger } from '../../core/logger';

const router = Router();

// Rate limiter using node-cache: max 15 requests per minute per IP
const rateLimitCache = new NodeCache({ stdTTL: 60 });
const RATE_LIMIT_COUNT = 15;

function rateLimiter(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'anonymous';
  const key = `rl_ai_advisor_${ip}`;
  const count = (rateLimitCache.get<number>(key) || 0) + 1;
  rateLimitCache.set(key, count);

  if (count > RATE_LIMIT_COUNT) {
    return res.status(429).json({
      success: false,
      message: 'Yêu cầu quá thường xuyên. Vui lòng đợi một phút và thử lại.',
    });
  }
  next();
}

const chatSchema = z.object({
  message: z.string().trim().min(1).max(2000, 'Message cannot exceed 2000 characters'),
  conversationId: z.string().uuid('Invalid conversationId format').optional(),
});

const feedbackSchema = z.object({
  feedbackType: z.enum(['THUMB_UP', 'THUMB_DOWN'], {
    errorMap: () => ({ message: 'feedbackType must be THUMB_UP or THUMB_DOWN' }),
  }),
  comment: z.string().trim().max(500, 'Comment cannot exceed 500 characters').optional(),
});

router.post('/chat', verifyAccessToken as any, rateLimiter as any, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const traceId = randomUUID();
  
  try {
    const body = chatSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Yêu cầu đăng nhập.',
        traceId,
      });
    }

    logger.info(`[AI-Advisor] [${traceId}] Request received. User: ${userId}`);

    // Verify conversation existence and ownership if conversationId is provided
    if (body.conversationId) {
      const existingConv = await prisma.aiConversation.findUnique({
        where: { id: body.conversationId },
      });

      if (!existingConv) {
        return res.status(404).json({
          success: false,
          message: 'Cuộc hội thoại không tồn tại.',
          traceId,
        });
      }

      if (existingConv.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền truy cập cuộc hội thoại này.',
          traceId,
        });
      }
    }

    const result = await askTravelAdvisor({
      message: body.message,
      userId,
      conversationId: body.conversationId,
      traceId,
    });

    logger.info(`[AI-Advisor] [${traceId}] Response generated successfully.`);

    return res.status(200).json({
      success: true,
      data: result,
      traceId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.issues[0]?.message || 'Yêu cầu không hợp lệ',
        traceId,
      });
    }

    logger.error(`[AI-Advisor] [${traceId}] Error processing request: ${(error as Error).message}`);
    
    return res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi xử lý yêu cầu của bạn.',
      traceId,
    });
  }
});

router.put('/messages/:messageId/feedback', verifyAccessToken as any, rateLimiter as any, async (req: AuthenticatedRequest, res: Response) => {
  const traceId = randomUUID();
  
  try {
    const messageId = req.params.messageId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Yêu cầu đăng nhập.',
        traceId,
      });
    }

    // Validate parameters format
    if (!z.string().uuid().safeParse(messageId).success) {
      return res.status(400).json({
        success: false,
        message: 'Định dạng messageId không hợp lệ.',
        traceId,
      });
    }

    const body = feedbackSchema.parse(req.body);

    // 1. Fetch message and verify role
    const message = await prisma.aiMessage.findUnique({
      where: { id: messageId },
      include: { conversation: true },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Tin nhắn không tồn tại.',
        traceId,
      });
    }

    if (message.role !== 'ASSISTANT') {
      return res.status(400).json({
        success: false,
        message: 'Chỉ được gửi phản hồi cho câu trả lời của trợ lý AI.',
        traceId,
      });
    }

    // 2. Verify conversation ownership
    if (message.conversation.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền gửi phản hồi cho tin nhắn này.',
        traceId,
      });
    }

    // 3. Upsert feedback record
    const feedback = await prisma.aiFeedback.upsert({
      where: {
        userId_messageId: {
          userId,
          messageId,
        },
      },
      update: {
        feedbackType: body.feedbackType,
        comment: body.comment || null,
      },
      create: {
        userId,
        messageId,
        feedbackType: body.feedbackType,
        comment: body.comment || null,
      },
    });

    return res.status(200).json({
      success: true,
      data: feedback,
      traceId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.issues[0]?.message || 'Yêu cầu không hợp lệ',
        traceId,
      });
    }

    logger.error(`[AI-Advisor] [${traceId}] Error saving feedback: ${(error as Error).message}`);
    
    return res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lưu phản hồi của bạn.',
      traceId,
    });
  }
});

export default router;
