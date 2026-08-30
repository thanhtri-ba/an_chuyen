import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const routes = await prisma.route.findMany({
    include: { departureCity: true, arrivalCity: true }
  });
  console.log("Routes:", routes.map(r => `${r.departureCity.name} -> ${r.arrivalCity.name}`));

  const schedules = await prisma.tripSchedule.findMany({
    take: 10,
    include: {
      trip: {
        include: {
          route: {
            include: { departureCity: true, arrivalCity: true }
          }
        }
      }
    }
  });

  console.log("Schedules:");
  schedules.forEach(s => {
    console.log(`- ${s.trip.route.departureCity.name} -> ${s.trip.route.arrivalCity.name} at ${s.departureTime}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
