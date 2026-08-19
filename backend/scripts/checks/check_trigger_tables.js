const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const loyaltyCols = await prisma.$queryRawUnsafe(`SELECT column_name FROM information_schema.columns WHERE table_name = 'loyalty'`);
  const profileCols = await prisma.$queryRawUnsafe(`SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles'`);
  console.log("Loyalty:", loyaltyCols);
  console.log("Profiles:", profileCols);
  await prisma.$disconnect();
}
run();
