import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const users = await prisma.user.count();
  const bookings = await prisma.booking.count();
  const payments = await prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'PAID' } });
  
  console.log("Users:", users);
  console.log("Bookings:", bookings);
  console.log("Revenue:", payments._sum.amount);
}
run().finally(() => prisma.$disconnect());
