const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function run() {
  console.log("Seeding HCM -> Da Lat trip...");

  const phamNguLaoId = 'aaf80b67-4cb3-4cfb-9c4d-7d68b563599d'; // HCM
  const daLatStationId = 'ab917241-737d-4ca6-ab15-bb12fc229810'; // Bến Xe Đà Lạt
  const phuongTrangId = '8d3024e0-b014-497f-8a07-c162424df77a';

  const trips = [
    {
      id: crypto.randomUUID(),
      agent_id: phuongTrangId,
      bus_class: 'LIMOUSINE',
      departure_time: '22:00:00',
      departure_station_id: phamNguLaoId,
      arrival_time: '05:00:00',
      arrival_station_id: daLatStationId,
      duration: '7h 00m',
      base_price: 350000,
      points_earned: 35
    }
  ];

  for (const t of trips) {
    await prisma.$executeRawUnsafe(`INSERT INTO trips (id, agent_id, bus_class, departure_time, departure_station_id, arrival_time, arrival_station_id, duration, base_price, points_earned, created_at) VALUES ('${t.id}', '${t.agent_id}', '${t.bus_class}', '${t.departure_time}', '${t.departure_station_id}', '${t.arrival_time}', '${t.arrival_station_id}', '${t.duration}', ${t.base_price}, ${t.points_earned}, NOW());`);
  }

  console.log("Trips seeded!");
  await prisma.$disconnect();
}
run().catch(console.error);
