const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  try {
    const proc = await prisma.$queryRawUnsafe(`
      SELECT prosrc 
      FROM pg_proc 
      WHERE proname = 'handle_new_user'
    `);
    console.log("Trigger source:", proc);
  } catch (e) {
    console.error(e);
  }
  await prisma.$disconnect();
}
run();
