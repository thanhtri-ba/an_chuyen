import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.seat.deleteMany({});
  console.log('All seats deleted. They will be regenerated on next API call.');
}
main().finally(() => prisma.$disconnect());
