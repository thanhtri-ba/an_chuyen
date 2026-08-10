const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const walletCols = await prisma.$queryRawUnsafe(`SELECT column_name FROM information_schema.columns WHERE table_name = 'wallets'`);
  console.log("Wallets:", walletCols);
  await prisma.$disconnect();
}
run();
