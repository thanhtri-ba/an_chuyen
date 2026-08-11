"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
describe('Admin authorization', () => {
    const secret = process.env.JWT_SECRET || 'test_secret';
    let userToken;
    let adminToken;
    beforeAll(() => {
        process.env.JWT_SECRET = secret;
        userToken = jsonwebtoken_1.default.sign({ role: 'user', email: 'user@example.com' }, secret, { subject: 'user_123', expiresIn: '15m' });
        adminToken = jsonwebtoken_1.default.sign({ role: 'admin', email: 'admin@example.com' }, secret, { subject: 'admin_123', expiresIn: '15m' });
    });
    it('returns 401 without token', async () => {
        await (0, supertest_1.default)(index_1.default)
            .get('/api/admin/users')
            .expect(401);
    });
    it('returns 403 for normal user', async () => {
        await (0, supertest_1.default)(index_1.default)
            .get('/api/admin/users')
            .set('Authorization', `Bearer ${userToken}`)
            .expect(403);
    });
    it('allows administrator', async () => {
        // We expect 200 or 500 or something else, but not 401/403.
        // If Prisma is not mocked, it might return 500 or 200 depending on DB connection.
        // But authorization middleware passes. Let's just ensure it does not return 401 or 403.
        const response = await (0, supertest_1.default)(index_1.default)
            .get('/api/admin/users')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(response.status).not.toBe(401);
        expect(response.status).not.toBe(403);
    });
});
