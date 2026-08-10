const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();
async function run() {
  try {
    const dummyId = '11111111-1111-1111-1111-111111111111';
    await prisma.$executeRawUnsafe(`
      INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) 
      VALUES (
        '${dummyId}',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'test@example.com',
        'dummy_hash',
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Guest User"}',
        now(),
        now()
      ) ON CONFLICT (id) DO NOTHING;
    `);
    console.log("Dummy user created in auth.users");
  } catch (e) {
    console.error(e);
  }
  await prisma.$disconnect();
}
run();
