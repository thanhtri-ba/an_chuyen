import 'dotenv/config';
import { PrismaClient, SeatClass, BookingStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL || '';
const urlWithLimit = dbUrl.includes('connection_limit') 
  ? dbUrl.replace(/connection_limit=\d+/, 'connection_limit=1')
  : (dbUrl.includes('?') ? `${dbUrl}&connection_limit=1` : `${dbUrl}?connection_limit=1`);

const prisma = new PrismaClient({
  datasources: { db: { url: urlWithLimit } }
});

async function main() {
  console.log('Generating 50 active users and bookings...');

  // Get some schedules
  const schedules = await prisma.tripSchedule.findMany({
    take: 10,
    include: {
      trip: {
        include: {
          route: true,
          busAgent: true
        }
      },
      seats: {
        where: { status: 'AVAILABLE' }
      }
    }
  });

  if (schedules.length === 0) {
    console.log("No trip schedules found. Run seed.ts first.");
    return;
  }

  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const bookingStatuses = ['PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  for (let i = 1; i <= 50; i++) {
    // 1. Create User
    const user = await prisma.user.create({
      data: {
        email: `customer${i}@example.com`,
        phone: `09${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        password: hashedPassword,
        fullName: `Khách Hàng ${i}`,
        role: 'user',
        isEmailVerified: true,
        isPhoneVerified: true
      }
    });

    // 2. Pick a random schedule
    const schedule = schedules[Math.floor(Math.random() * schedules.length)];
    
    // Pick 1-2 seats
    const numSeats = Math.floor(Math.random() * 2) + 1;
    const availableSeats = schedule.seats.slice(0, numSeats);
    
    if (availableSeats.length === 0) continue; // No seats

    const status = bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)] as BookingStatus;
    const amount = 250000 * numSeats;

    // 3. Create Booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        tripScheduleId: schedule.id,
        status: status,
        totalAmount: amount,
        isRoundTrip: false,
        passengers: {
          create: availableSeats.map((_, idx) => ({
            name: `Hành Khách ${i}.${idx + 1}`,
            idCard: `00109${Math.floor(Math.random() * 1000000)}`
          }))
        },
        seatBookings: {
          create: availableSeats.map(s => ({
            seatId: s.id
          }))
        },
        payment: {
          create: {
            method: 'VNPAY',
            amount: amount,
            status: status === 'CONFIRMED' || status === 'COMPLETED' ? 'PAID' : 'PENDING'
          }
        },
        timelines: {
          create: [
            {
              status: 'PENDING_PAYMENT',
              note: 'Booking created'
            }
          ]
        }
      }
    });
    
    // Update seats to BOOKED if CONFIRMED
    if (status === 'CONFIRMED' || status === 'COMPLETED') {
        for (const seat of availableSeats) {
            await prisma.seat.update({
                where: { id: seat.id },
                data: { status: 'BOOKED' }
            });
        }
    }

    console.log(`Created booking for user ${user.fullName} with status ${status}`);
  }
  
  console.log('Successfully generated 50 users and bookings!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
