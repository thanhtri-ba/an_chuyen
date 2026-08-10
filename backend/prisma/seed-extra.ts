import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding extra data for Tours, Events, and Delivery...');
  
  // Clean up
  await prisma.tourItinerary.deleteMany();
  await prisma.tourReview.deleteMany();
  await prisma.tour.deleteMany();
  
  await prisma.eventTicket.deleteMany();
  await prisma.eventPerformer.deleteMany();
  await prisma.event.deleteMany();

  await prisma.deliveryDriver.deleteMany();
  await prisma.deliveryVehicle.deleteMany();

  // 1. Tours
  const tour1 = await prisma.tour.create({
    data: {
      title: 'Bali Paradise Retreat',
      description: 'The Bali retreat was everything I hoped for and more. The logistics were flawless, and our guide Made was exceptional.',
      duration: '7 days',
      price: 999,
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600',
      itineraries: {
        create: [
          { day: 1, title: 'Arrival & Welcome', description: 'Airport transfer, check-in at The Royal Resort. Evening welcome dinner.', tags: 'Hotel, Dinner' },
          { day: 2, title: 'Temple Tour', description: 'Full day guided tour of ancient water temples and rice terraces.', tags: 'Tour, Guide' },
          { day: 3, title: 'Free Time & Spa', description: 'Morning at leisure. Afternoon 2-hour traditional massage session.', tags: 'Spa, Leisure' }
        ]
      },
      reviews: {
        create: [
          { reviewerName: 'Jane Smith', reviewerInitials: 'JS', rating: 5, comment: 'The Bali retreat was everything I hoped for and more. The logistics were flawless, and our guide Made was exceptional.' },
          { reviewerName: 'Mike Davis', reviewerInitials: 'MD', rating: 5, comment: 'Incredible experience on the Machu Picchu trek. The food was surprisingly good for camping!' }
        ]
      }
    }
  });

  const tour2 = await prisma.tour.create({
    data: {
      title: 'Machu Picchu Expedition',
      description: 'Incredible experience on the Machu Picchu trek. The food was surprisingly good for camping!',
      duration: '5 days',
      price: 1450,
      imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=600&q=80',
    }
  });

  console.log('Seeded Tours');

  // 2. Events
  const event1 = await prisma.event.create({
    data: {
      title: 'Tomorrowland Winter',
      description: 'The magic of Tomorrowland in a winter wonderland setting.',
      date: new Date('2027-03-15T18:00:00Z'),
      location: 'Alpe d\'Huez, France',
      category: 'Music',
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c092bb8357a?auto=format&fit=crop&w=800&q=80',
      performers: {
        create: [
          { name: 'Martin Garrix', role: 'DJ' },
          { name: 'David Guetta', role: 'DJ' }
        ]
      },
      tickets: {
        create: [
          { ticketTier: 'Standard', price: 299 },
          { ticketTier: 'VIP', price: 899 }
        ]
      }
    }
  });
  console.log('Seeded Events');

  // 3. Delivery
  const vehicle = await prisma.deliveryVehicle.create({
    data: {
      name: 'Motorbike',
      description: 'Up to 10kg • Fast',
      price: 20000,
      capacityWeight: 10,
      drivers: {
        create: [
          { name: 'Mike P.', plateNumber: '59A-12345', rating: 4.9 },
          { name: 'Sarah J.', plateNumber: '29B-98765', rating: 4.8 }
        ]
      }
    }
  });

  console.log('Seeded Delivery');
  console.log('Extra Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
