import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const seats = await prisma.seat.findMany({ take: 10 });
  console.log('Sample seats:', seats);
  
  const statusCounts = await prisma.seat.groupBy({
    by: ['status'],
    _count: {
      status: true
    }
  });
  console.log('Status counts:', statusCounts);
}
main().finally(() => prisma.$disconnect());
