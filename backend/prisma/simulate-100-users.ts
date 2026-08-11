import 'dotenv/config';
import { PrismaClient, BookingStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL || '';
const urlWithLimit = dbUrl.includes('connection_limit') 
  ? dbUrl.replace(/connection_limit=\d+/, 'connection_limit=5') // Use 5 connections for simulation
  : (dbUrl.includes('?') ? `${dbUrl}&connection_limit=5` : `${dbUrl}?connection_limit=5`);

const prisma = new PrismaClient({
  datasources: { db: { url: urlWithLimit } }
});

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function simulate() {
  console.log('Starting simulation of 100 real users...');
  const report = {
    totalAttempted: 100,
    successfulBookings: 0,
    failedBookings: 0,
    errors: [] as string[],
    startTime: new Date().toISOString(),
    endTime: '',
  };

  try {
    const schedules = await prisma.tripSchedule.findMany({
      take: 20,
      include: {
        seats: true,
        trip: { include: { route: true } }
      }
    });

    if (schedules.length === 0) {
      report.errors.push('No trip schedules available in database to book.');
      report.endTime = new Date().toISOString();
      console.log(JSON.stringify(report));
      return;
    }

    const hashedPassword = await bcrypt.hash('123456', 10);
    const bookingStatuses = ['PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

    // We process in batches of 10 to simulate concurrency without overloading the DB too much
    for (let batch = 0; batch < 10; batch++) {
      const promises = [];
      for (let i = 1; i <= 10; i++) {
        const userIndex = batch * 10 + i;
        promises.push((async () => {
          try {
            // Simulate User Registration
            const user = await prisma.user.create({
              data: {
                email: `simulated_user_${userIndex}_${Date.now()}@example.com`,
                phone: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
                password: hashedPassword,
                fullName: `Simulated User ${userIndex}`,
                role: 'user',
              }
            });

            // Simulate searching & picking schedule
            await delay(Math.random() * 1000); // 0-1s delay
            const schedule = schedules[Math.floor(Math.random() * schedules.length)];

            // Refresh seats to get latest status (simulating real-time booking conflict)
            const latestSchedule = await prisma.tripSchedule.findUnique({
              where: { id: schedule.id },
              include: { seats: { where: { status: 'AVAILABLE' } } }
            });

            if (!latestSchedule || latestSchedule.seats.length === 0) {
              throw new Error(`Schedule ${schedule.id} has no available seats left.`);
            }

            const numSeats = Math.min(Math.floor(Math.random() * 3) + 1, latestSchedule.seats.length);
            const selectedSeats = latestSchedule.seats.slice(0, numSeats);
            
            // Mark seats as locked (simulating holding seats) - using transaction
            const lockResult = await prisma.$transaction(async (tx) => {
              // Check again inside tx
              const currentSeats = await tx.seat.findMany({
                where: { id: { in: selectedSeats.map(s => s.id) }, status: 'AVAILABLE' }
              });
              if (currentSeats.length !== numSeats) {
                throw new Error(`Concurrency error: Seats taken by someone else.`);
              }
              // Update
              await tx.seat.updateMany({
                where: { id: { in: currentSeats.map(s => s.id) } },
                data: { status: 'BOOKED' }
              });
              return currentSeats;
            });

            const status = bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)] as BookingStatus;
            const amount = 300000 * numSeats;

            // Create booking
            await delay(Math.random() * 500); // Simulate form fill
            
            const booking = await prisma.booking.create({
              data: {
                userId: user.id,
                tripScheduleId: schedule.id,
                status: status,
                totalAmount: amount,
                isRoundTrip: false,
                passengers: {
                  create: lockResult.map((_, idx) => ({
                    name: `Hành Khách Phụ ${userIndex}.${idx + 1}`,
                    idCard: `00109${Math.floor(Math.random() * 1000000)}`
                  }))
                },
                seatBookings: {
                  create: lockResult.map(s => ({
                    seatId: s.id
                  }))
                },
                payment: {
                  create: {
                    method: 'VNPAY',
                    amount: amount,
                    status: status === 'CONFIRMED' || status === 'COMPLETED' ? 'PAID' : 'PENDING'
                  }
                }
              }
            });

            // If CANCELLED or PENDING, revert seats to available (Simulate timeout)
            if (status === 'CANCELLED') {
              await prisma.seat.updateMany({
                where: { id: { in: lockResult.map(s => s.id) } },
                data: { status: 'AVAILABLE' }
              });
            }

            // Simulate rating if completed
            if (status === 'COMPLETED') {
              await delay(200);
              await prisma.review.create({
                data: {
                  userId: user.id,
                  tripId: schedule.tripId,
                  rating: Math.floor(Math.random() * 3) + 3, // 3 to 5 stars
                  comment: "Chuyến đi rất tốt, tài xế thân thiện!",
                }
              });
            }

            report.successfulBookings++;
          } catch (err: any) {
            report.failedBookings++;
            report.errors.push(`User ${userIndex} failed: ${err.message}`);
          }
        })());
      }
      
      // Wait for batch to finish
      await Promise.all(promises);
      console.log(`Finished batch ${batch + 1}/10`);
    }

  } catch (err: any) {
    report.errors.push(`Fatal Error: ${err.message}`);
  } finally {
    report.endTime = new Date().toISOString();
    console.log("===SIMULATION_REPORT===");
    console.log(JSON.stringify(report, null, 2));
    await prisma.$disconnect();
  }
}

simulate().catch(console.error);
