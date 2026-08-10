const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const citiesCols = await prisma.$queryRawUnsafe(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'cities'`);
  const agentCols = await prisma.$queryRawUnsafe(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'bus_agents'`);
  console.log("cities:", citiesCols);
  console.log("bus_agents:", agentCols);
  await prisma.$disconnect();
}
run();
