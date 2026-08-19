import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.time('Connect & Query');
  const count = await prisma.tripSchedule.count();
  console.timeEnd('Connect & Query');
  console.log('Count:', count);
}
main().finally(() => prisma.$disconnect());
