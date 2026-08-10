const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const users = await prisma.$queryRawUnsafe(`SELECT id FROM auth.users LIMIT 1`);
  console.log("First Auth User:", users);
  await prisma.$disconnect();
}
run().catch(console.error);
