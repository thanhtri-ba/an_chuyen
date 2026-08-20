const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.tripSchedule.count();
  const schedules = await prisma.tripSchedule.findMany({
    take: 1,
    orderBy: { departureTime: 'asc' }
  });
  console.log('Total schedules:', count);
  if (schedules.length > 0) {
    console.log('Earliest schedule:', schedules[0].departureTime);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
