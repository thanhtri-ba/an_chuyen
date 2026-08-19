const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  try {
    const triggers = await prisma.$queryRawUnsafe(`
      SELECT tgname, relname, proname 
      FROM pg_trigger 
      JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid 
      JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
      WHERE relname = 'users'
    `);
    console.log("Triggers on users table:", triggers);
  } catch (e) {
    console.error(e);
  }
  await prisma.$disconnect();
}
run();
