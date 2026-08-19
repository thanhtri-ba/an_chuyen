import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  const data = await prisma.tripSchedule.findMany({
    include: {
      trip: {
        include: {
          route: {
            include: { startCity: true, endCity: true }
          }
        }
      },
      prices: true
    },
    take: 3
  });
  console.log(JSON.stringify(data, null, 2));
}
run();
