import request from 'supertest';
import app from '../index';
import jwt from 'jsonwebtoken';
import { travelAdvisorAgent } from '../modules/ai-advisor/agents/travel-advisor.agent';
import { prisma } from '../core/prisma';

jest.mock('../modules/ai-advisor/agents/travel-advisor.agent', () => {
  return {
    travelAdvisorAgent: {
      generate: jest.fn(),
    },
  };
});

describe('AI Advisor History & Feedback API Tests', () => {
  const secret = process.env.JWT_SECRET || 'busz_super_secret_jwt_key_2026';
  let user1Token: string;
  let user2Token: string;
  let user1Id = 'user-1-uuid';
  let user2Id = 'user-2-uuid';

  beforeAll(async () => {
    process.env.JWT_SECRET = secret;
    
    user1Token = jwt.sign(
      { role: 'user', email: 'user1@example.com' },
      secret,
      { subject: user1Id, expiresIn: '15m' }
    );

    user2Token = jwt.sign(
      { role: 'user', email: 'user2@example.com' },
      secret,
      { subject: user2Id, expiresIn: '15m' }
    );

    // Ensure test users exist in database to satisfy relations
    await prisma.user.upsert({
      where: { id: user1Id },
      update: {},
      create: {
        id: user1Id,
        email: 'user1@example.com',
        fullName: 'User One',
        role: 'user',
      },
    });

    await prisma.user.upsert({
      where: { id: user2Id },
      update: {},
      create: {
        id: user2Id,
        email: 'user2@example.com',
        fullName: 'User Two',
        role: 'user',
      },
    });
  });

  afterAll(async () => {
    // Cleanup AI test data
    await prisma.aiFeedback.deleteMany();
    await prisma.aiMessage.deleteMany();
    await prisma.aiConversation.deleteMany();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/ai-advisor/chat - Persistence & Ownership', () => {
    it('saves user and assistant messages in database and returns IDs', async () => {
      const mockOutput = {
        message: 'Chào bạn, tôi là trợ lý AI.',
        intent: 'greeting',
        missingFields: [],
        recommendations: [],
        warnings: [],
        requiresConfirmation: false,
      };

      (travelAdvisorAgent.generate as jest.Mock).mockResolvedValue({
        object: mockOutput,
      });

      const res = await request(app)
        .post('/api/ai-advisor/chat')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ message: 'Chào AI' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.conversationId).toBeDefined();
      expect(res.body.data.messageId).toBeDefined();
      expect(res.body.data.reply).toBe('Chào bạn, tôi là trợ lý AI.');

      // Check database entries
      const conv = await prisma.aiConversation.findUnique({
        where: { id: res.body.data.conversationId },
        include: { messages: true },
      });

      expect(conv).toBeDefined();
      expect(conv?.userId).toBe(user1Id);
      expect(conv?.messages).toHaveLength(2);
      expect(conv?.messages.find((m) => m.role === 'USER')?.content).toBe('Chào AI');
      expect(conv?.messages.find((m) => m.role === 'ASSISTANT')?.content).toBe('Chào bạn, tôi là trợ lý AI.');
    });

    it('rejects continuing a conversation owned by another user', async () => {
      const otherConv = await prisma.aiConversation.create({
        data: { userId: user2Id },
      });

      await request(app)
        .post('/api/ai-advisor/chat')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ message: 'Hello', conversationId: otherConv.id })
        .expect(403);
    });

    it('responds safely with fallback if database saving fails', async () => {
      // Mock prisma.aiConversation.create to throw error
      const mockCreate = jest.spyOn(prisma.aiConversation, 'create').mockRejectedValueOnce(new Error('DB connection error'));

      const mockOutput = {
        message: 'Phản hồi bình thường.',
        intent: 'greeting',
        missingFields: [],
        recommendations: [],
        warnings: [],
        requiresConfirmation: false,
      };

      (travelAdvisorAgent.generate as jest.Mock).mockResolvedValue({
        object: mockOutput,
      });

      const res = await request(app)
        .post('/api/ai-advisor/chat')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ message: 'Test DB error fallback' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.reply).toBe('Phản hồi bình thường.');
      expect(res.body.data.conversationId).toBeNull();
      expect(res.body.data.messageId).toBeNull();
      expect(res.body.data.feedbackEnabled).toBe(false);

      mockCreate.mockRestore();
    });
  });

  describe('PUT /api/ai-advisor/messages/:messageId/feedback - Feedback Collections', () => {
    let conversationId: string;
    let assistantMessageId: string;
    let userMessageId: string;

    beforeAll(async () => {
      const conv = await prisma.aiConversation.create({
        data: { userId: user1Id },
      });
      conversationId = conv.id;

      const uMsg = await prisma.aiMessage.create({
        data: { conversationId, role: 'USER', content: 'User message' },
      });
      userMessageId = uMsg.id;

      const aMsg = await prisma.aiMessage.create({
        data: { conversationId, role: 'ASSISTANT', content: 'AI reply message' },
      });
      assistantMessageId = aMsg.id;
    });

    it('rejects feedback without authentication token', async () => {
      await request(app)
        .put(`/api/ai-advisor/messages/${assistantMessageId}/feedback`)
        .send({ feedbackType: 'THUMB_UP' })
        .expect(401);
    });

    it('rejects invalid feedback payload format', async () => {
      await request(app)
        .put(`/api/ai-advisor/messages/${assistantMessageId}/feedback`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ feedbackType: 'INVALID_TYPE' })
        .expect(400);
    });

    it('returns 404 for non-existent message feedback', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      await request(app)
        .put(`/api/ai-advisor/messages/${nonExistentId}/feedback`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ feedbackType: 'THUMB_UP' })
        .expect(404);
    });

    it('rejects feedback on a USER message', async () => {
      await request(app)
        .put(`/api/ai-advisor/messages/${userMessageId}/feedback`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ feedbackType: 'THUMB_UP' })
        .expect(400);
    });

    it('rejects feedback for assistant message owned by another user', async () => {
      await request(app)
        .put(`/api/ai-advisor/messages/${assistantMessageId}/feedback`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ feedbackType: 'THUMB_UP' })
        .expect(403);
    });

    it('saves user feedback successfully and supports updates', async () => {
      // 1. Create feedback THUMB_UP
      let res = await request(app)
        .put(`/api/ai-advisor/messages/${assistantMessageId}/feedback`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ feedbackType: 'THUMB_UP', comment: 'Rất bổ ích!' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.feedbackType).toBe('THUMB_UP');
      expect(res.body.data.comment).toBe('Rất bổ ích!');

      // Check DB
      let fb = await prisma.aiFeedback.findUnique({
        where: { messageId: assistantMessageId },
      });
      expect(fb).toBeDefined();
      expect(fb?.feedbackType).toBe('THUMB_UP');

      // 2. Update to THUMB_DOWN (Idempotent update)
      res = await request(app)
        .put(`/api/ai-advisor/messages/${assistantMessageId}/feedback`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ feedbackType: 'THUMB_DOWN', comment: 'Chưa chính xác' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.feedbackType).toBe('THUMB_DOWN');

      fb = await prisma.aiFeedback.findUnique({
        where: { messageId: assistantMessageId },
      });
      expect(fb?.feedbackType).toBe('THUMB_DOWN');
      expect(fb?.comment).toBe('Chưa chính xác');
    });
  });
});
