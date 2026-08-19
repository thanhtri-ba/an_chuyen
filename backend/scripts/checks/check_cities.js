const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const cities = await prisma.$queryRawUnsafe(`SELECT * FROM cities`);
  console.log(cities);
  await prisma.$disconnect();
}
run();
