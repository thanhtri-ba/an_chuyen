import 'dotenv/config';
import { PrismaClient, SeatClass } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProductionData() {
  try {
    console.log('🌱 Seeding production database with test data...');

    // 1. Create/Find Province
    let province = await prisma.province.findFirst({
      where: { name: 'Việt Nam' }
    });

    if (!province) {
      province = await prisma.province.create({
        data: { name: 'Việt Nam' }
      });
      console.log('✅ Created Province: Việt Nam');
    }

    // 2. Create/Find Cities
    const cityNames = [
      { name: 'TP.HCM', subtitle: 'Thành phố Hồ Chí Minh' },
      { name: 'Nha Trang', subtitle: 'Biển xanh ngọc bích' },
      { name: 'Đà Lạt', subtitle: 'Thành phố ngàn hoa' }
    ];

    const cities: any = {};
    for (const cityData of cityNames) {
      let city = await prisma.city.findFirst({
        where: { name: cityData.name }
      });

      if (!city) {
        city = await prisma.city.create({
          data: {
            name: cityData.name,
            provinceId: province.id,
            subtitle: cityData.subtitle,
            isPopular: true
          }
        });
        console.log(`✅ Created City: ${cityData.name}`);
      }
      cities[cityData.name] = city;
    }

    // 3. Create Stations for each city
    const stations: any = {};
    for (const [cityName, city] of Object.entries(cities)) {
      let station = await prisma.station.findFirst({
        where: { cityId: (city as any).id, name: { contains: cityName } }
      });

      if (!station) {
        station = await prisma.station.create({
          data: {
            name: `Bến xe ${cityName}`,
            cityId: (city as any).id,
            isPopular: true
          }
        });
        console.log(`✅ Created Station: ${(station as any).name}`);
      }
      stations[cityName] = station;
    }

    // 4. Create Routes
    const routeConfigs = [
      { from: 'TP.HCM', to: 'Nha Trang', price: 220000, duration: 540 },
      { from: 'TP.HCM', to: 'Đà Lạt', price: 180000, duration: 420 },
      { from: 'Nha Trang', to: 'Đà Lạt', price: 150000, duration: 360 }
    ];

    const routes: any = {};
    for (const routeConfig of routeConfigs) {
      const key = `${routeConfig.from}-${routeConfig.to}`;
      
      let route = await prisma.route.findFirst({
        where: {
          departureCityId: (cities[routeConfig.from] as any).id,
          arrivalCityId: (cities[routeConfig.to] as any).id
        }
      });

      if (!route) {
        route = await prisma.route.create({
          data: {
            departureCityId: (cities[routeConfig.from] as any).id,
            arrivalCityId: (cities[routeConfig.to] as any).id,
            basePrice: routeConfig.price,
            durationMins: routeConfig.duration,
            isPopular: true
          }
        });
        console.log(`✅ Created Route: ${routeConfig.from} → ${routeConfig.to}`);
      }
      routes[key] = route;
    }

    // 5. Create Bus Agent
    let busAgent = await prisma.busAgent.findFirst({
      where: { name: 'Phương Trang' }
    });

    if (!busAgent) {
      busAgent = await prisma.busAgent.create({
        data: {
          name: 'Phương Trang',
          rating: 4.8,
          reviewCount: 250
        }
      });
      console.log('✅ Created Bus Agent: Phương Trang');
    }

    // 6. Create Trips and Schedules for each route
    for (const [routeKey, route] of Object.entries(routes)) {
      // Check if trips exist for this route
      const existingTrips = await prisma.trip.findMany({
        where: { routeId: (route as any).id }
      });

      if (existingTrips.length === 0) {
        // Create a trip
        const trip = await prisma.trip.create({
          data: {
            busAgentId: busAgent.id,
            routeId: (route as any).id,
            busClass: SeatClass.EXECUTIVE
          }
        });

        // Create trip schedule for tomorrow at 10:00
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);

        const routeData = route as any;
        const arrivalTime = new Date(tomorrow.getTime() + routeData.durationMins * 60 * 1000);

        const schedule = await prisma.tripSchedule.create({
          data: {
            tripId: trip.id,
            departureTime: tomorrow,
            arrivalTime,
            durationMins: routeData.durationMins
          }
        });

        // Create trip price
        await prisma.tripPrice.create({
          data: {
            tripScheduleId: schedule.id,
            seatClass: SeatClass.EXECUTIVE,
            price: routeData.basePrice
          }
        });

        // Create 40 seats (A1-A40)
        for (let i = 1; i <= 40; i++) {
          await prisma.seat.create({
            data: {
              tripScheduleId: schedule.id,
              seatNumber: `A${i}`,
              status: 'AVAILABLE'
            }
          });
        }

        console.log(`✅ Created Trip & Schedule for ${routeKey} (40 seats)`);
      }
    }

    console.log('');
    console.log('🎉 Production database seeded successfully!');
    console.log('');
    console.log('📊 Test Data Summary:');
    console.log('  - Cities: 3 (TP.HCM, Nha Trang, Đà Lạt)');
    console.log('  - Routes: 3');
    console.log('  - Trips: 3 (1 per route)');
    console.log('  - Seats: 120 total (40 per trip)');
    console.log('');
    console.log('🚀 Ready to test booking flow!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedProductionData();
