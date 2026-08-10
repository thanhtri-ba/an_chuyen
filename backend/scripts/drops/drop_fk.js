const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE public.profiles DROP CONSTRAINT profiles_id_fkey;`);
    console.log("Dropped foreign key");
  } catch (e) {
    console.log("No foreign key or error:", e);
  }
  await prisma.$disconnect();
}
run();
