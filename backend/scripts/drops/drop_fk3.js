const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE public.user_addresses DROP CONSTRAINT IF EXISTS user_addresses_user_id_fkey;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE public.wallets DROP CONSTRAINT IF EXISTS wallets_user_id_fkey;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE public.loyalty DROP CONSTRAINT IF EXISTS loyalty_user_id_fkey;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE public.user_payment_methods DROP CONSTRAINT IF EXISTS user_payment_methods_user_id_fkey;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE public.search_histories DROP CONSTRAINT IF EXISTS search_histories_user_id_fkey;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE public.favorite_routes DROP CONSTRAINT IF EXISTS favorite_routes_user_id_fkey;`);
    console.log("Dropped specific foreign keys");
  } catch (e) {
    console.log("Error:", e);
  }
  await prisma.$disconnect();
}
run();
