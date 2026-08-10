const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const tripCols = await prisma.$queryRawUnsafe(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'trips'`);
  const stationCols = await prisma.$queryRawUnsafe(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'stations'`);
  console.log("trips:", tripCols);
  console.log("stations:", stationCols);
  await prisma.$disconnect();
}
run();
