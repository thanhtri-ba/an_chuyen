const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const stations = await prisma.$queryRawUnsafe(`SELECT * FROM stations`);
  const agents = await prisma.$queryRawUnsafe(`SELECT * FROM bus_agents`);
  console.log("stations:", stations);
  console.log("agents:", agents);
  await prisma.$disconnect();
}
run();
