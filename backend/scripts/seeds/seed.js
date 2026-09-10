const { PrismaClient, SeatClass } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log("Seeding data based on Prisma schema...");

  // 1. Create Provinces
  const provHCM = await prisma.province.create({ data: { name: 'Hồ Chí Minh' } });
  const provLamDong = await prisma.province.create({ data: { name: 'Lâm Đồng' } });

  // 2. Create Cities
  const cityHCM = await prisma.city.create({ data: { name: 'Hồ Chí Minh', provinceId: provHCM.id } });
  const cityDaLat = await prisma.city.create({ data: { name: 'Đà Lạt', provinceId: provLamDong.id } });

  // 3. Create Stations
  const stationHCM = await prisma.station.create({ data: { name: 'Bến xe Miền Đông', cityId: cityHCM.id, isPopular: true } });
  const stationDaLat = await prisma.station.create({ data: { name: 'Bến xe liên tỉnh Đà Lạt', cityId: cityDaLat.id, isPopular: true } });

  // 4. Create Route
  const route = await prisma.route.create({
    data: {
      departureCityId: cityHCM.id,
      arrivalCityId: cityDaLat.id
    }
  });

  // 5. Create Bus Agent
  const agent = await prisma.busAgent.create({
    data: {
      name: 'Phương Trang (FUTA Bus)',
      logo: 'https://futabus.vn/images/logo.png',
      rating: 4.5,
      reviewCount: 120
    }
  });

  // 6. Create Trip
  const trip = await prisma.trip.create({
    data: {
      busAgentId: agent.id,
      routeId: route.id,
      busClass: SeatClass.SLEEPER
    }
  });

  // 7. Create Trip Schedule (Today + 1 at 22:00)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(22, 0, 0, 0);
  
  const arrival = new Date(tomorrow);
  arrival.setHours(arrival.getHours() + 7);

  const schedule = await prisma.tripSchedule.create({
    data: {
      tripId: trip.id,
      departureTime: tomorrow,
      arrivalTime: arrival,
      durationMins: 420
    }
  });

  // 8. Create Trip Price
  await prisma.tripPrice.create({
    data: {
      tripScheduleId: schedule.id,
      seatClass: SeatClass.SLEEPER,
      price: 350000
    }
  });

  // Seats are intentionally not created here — SeatService.getSeatMap() lazily
  // generates the real T{floor}-{row}{col} seat map on first request. Pre-creating
  // "A1".."A10" rows here used to produce seats in a format the frontend/booking
  // flow can't parse, silently breaking seat selection for the trip this seeds.

  console.log("Seeding completed successfully!");
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
