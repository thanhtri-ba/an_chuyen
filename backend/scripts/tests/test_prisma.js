const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  try {
    const trips = await prisma.trip.findMany();
    console.log(trips);
  } catch (e) {
    console.error(e.message);
  }
  await prisma.$disconnect();
}
run();
