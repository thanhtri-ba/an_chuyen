const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  try {
    const users = await prisma.user.findMany({ take: 1 });
    console.log("Users in DB:", users);
  } catch (e) {
    console.error("Error accessing User table:", e);
  }
  await prisma.$disconnect();
}
run();
