const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const tables = await prisma.$queryRawUnsafe(`SELECT tablename FROM pg_tables WHERE schemaname='public'`);
  console.log(tables);
  await prisma.$disconnect();
}
run().catch(console.error);
