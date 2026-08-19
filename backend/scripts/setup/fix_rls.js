const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Fixing RLS for user_addresses...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "user_addresses" DISABLE ROW LEVEL SECURITY;`);
    console.log("Disabled RLS on user_addresses.");
    
    console.log("Fixing RLS for user_payment_methods...");
    await prisma.$executeRawUnsafe(`ALTER TABLE "user_payment_methods" DISABLE ROW LEVEL SECURITY;`);
    console.log("Disabled RLS on user_payment_methods.");
    
    console.log("Done.");
  } catch (e) {
    console.error("Error executing query:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
