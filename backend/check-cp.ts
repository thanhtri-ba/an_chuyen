import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const scheduleId = process.argv[2];
  if (scheduleId) {
    const checkpoints = await prisma.checkpoint.findMany({ where: { tripScheduleId: scheduleId }, include: { station: true } });
    console.log('Checkpoints for ' + scheduleId + ':', checkpoints);
  } else {
    const cp = await prisma.checkpoint.findFirst();
    console.log('Any checkpoint:', cp);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
