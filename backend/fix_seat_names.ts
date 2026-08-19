import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const seats = await prisma.seat.findMany();
  let updatedCount = 0;
  for (const seat of seats) {
    if (!seat.seatNumber.startsWith('T')) {
      // It's probably like A1, B2, etc.
      // E.g. A1 -> T1-1A? Or maybe A1 -> A is row, 1 is col? No, usually A1 is row A, col 1.
      // But in the app's standard: T{floor}-{row}{col}, e.g. T1-1A
      // If it's A1, let's map it to T1-1A.
      let newName = '';
      if (seat.seatNumber.length === 2) {
        const col = seat.seatNumber[0];
        const row = seat.seatNumber[1];
        newName = `T1-${row}${col}`;
      } else {
        newName = `T1-1${seat.seatNumber[0]}`;
      }
      
      try {
        await prisma.seat.update({
          where: { id: seat.id },
          data: { seatNumber: newName }
        });
        updatedCount++;
      } catch (e) {
        // ignore unique constraint errors if any
      }
    }
  }
  console.log(`Updated ${updatedCount} seats.`);
}
main().finally(() => prisma.$disconnect());
