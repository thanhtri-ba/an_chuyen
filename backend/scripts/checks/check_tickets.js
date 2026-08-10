const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const cols = await prisma.$queryRawUnsafe(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'tickets'`);
  console.log("tickets:", cols);
  await prisma.$disconnect();
}
run();
