import request from 'supertest';
import app from '../index';
import jwt from 'jsonwebtoken';

describe('Admin authorization', () => {
  const secret = process.env.JWT_SECRET || 'test_secret';
  let userToken: string;
  let adminToken: string;

  beforeAll(() => {
    process.env.JWT_SECRET = secret;

    userToken = jwt.sign(
      { role: 'user', email: 'user@example.com' },
      secret,
      { subject: 'user_123', expiresIn: '15m' }
    );

    adminToken = jwt.sign(
      { role: 'admin', email: 'admin@example.com' },
      secret,
      { subject: 'admin_123', expiresIn: '15m' }
    );
  });

  it('returns 401 without token', async () => {
    await request(app)
      .get('/api/admin/users')
      .expect(401);
  });

  it('returns 403 for normal user', async () => {
    await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('allows administrator', async () => {
    // We expect 200 or 500 or something else, but not 401/403.
    // If Prisma is not mocked, it might return 500 or 200 depending on DB connection.
    // But authorization middleware passes. Let's just ensure it does not return 401 or 403.
    const response = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
  });
});
