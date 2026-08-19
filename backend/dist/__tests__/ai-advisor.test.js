"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const travel_advisor_agent_1 = require("../modules/ai-advisor/agents/travel-advisor.agent");
jest.mock('../modules/ai-advisor/agents/travel-advisor.agent', () => {
    return {
        travelAdvisorAgent: {
            generate: jest.fn(),
        },
    };
});
describe('AI Advisor APIs and logic tests', () => {
    const secret = process.env.JWT_SECRET || 'busz_super_secret_jwt_key_2026';
    let userToken;
    beforeAll(() => {
        process.env.JWT_SECRET = secret;
        userToken = jsonwebtoken_1.default.sign({ role: 'user', email: 'test@example.com' }, secret, { subject: 'user_123', expiresIn: '15m' });
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('rejects requests without authentication token', async () => {
        await (0, supertest_1.default)(index_1.default)
            .post('/api/ai-advisor/chat')
            .send({ message: 'Hello' })
            .expect(401);
    });
    it('rejects empty message requests', async () => {
        await (0, supertest_1.default)(index_1.default)
            .post('/api/ai-advisor/chat')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ message: '   ' })
            .expect(400);
    });
    it('rejects message requests exceeding 2000 characters', async () => {
        const longMessage = 'a'.repeat(2001);
        await (0, supertest_1.default)(index_1.default)
            .post('/api/ai-advisor/chat')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ message: longMessage })
            .expect(400);
    });
    it('returns fallback response when Ollama/Agent fails', async () => {
        travel_advisor_agent_1.travelAdvisorAgent.generate.mockRejectedValue(new Error('Connection failed'));
        const response = await (0, supertest_1.default)(index_1.default)
            .post('/api/ai-advisor/chat')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ message: 'Tìm xe đi Đà Lạt' })
            .expect(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.intent).toBe('fallback_error');
        expect(response.body.data.message).toContain('sự cố kết nối');
    });
    it('correctly processes successful agent generation response', async () => {
        const mockOutput = {
            message: 'Tôi tìm thấy chuyến đi Đà Lạt ngày mai.',
            intent: 'search_trips',
            missingFields: [],
            recommendations: [
                {
                    tripScheduleId: 'schedule_123',
                    departureTime: '2026-07-27T08:00:00Z',
                    arrivalTime: '2026-07-27T14:00:00Z',
                    busAgentName: 'Phương Trang',
                    price: 300000,
                    availableSeats: 15,
                    score: 95,
                    reasons: ['Giá rẻ', 'Giờ đi tốt'],
                },
            ],
            warnings: [],
            requiresConfirmation: true,
        };
        travel_advisor_agent_1.travelAdvisorAgent.generate.mockResolvedValue({
            object: mockOutput,
        });
        const response = await (0, supertest_1.default)(index_1.default)
            .post('/api/ai-advisor/chat')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ message: 'Tìm xe từ Sài Gòn đi Đà Lạt ngày mai' })
            .expect(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.intent).toBe('search_trips');
        expect(response.body.data.requiresConfirmation).toBe(true);
        expect(response.body.data.recommendations).toHaveLength(1);
        expect(response.body.traceId).toBeDefined();
    });
});
