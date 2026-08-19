const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function run() {
  console.log("Seeding trips...");

  const myDinhId = 'cfb00aa8-2372-4adf-8cc4-ab3f2a36c03b';
  const phamNguLaoId = 'aaf80b67-4cb3-4cfb-9c4d-7d68b563599d';
  const phuongTrangId = '8d3024e0-b014-497f-8a07-c162424df77a';
  const hoangLongId = '371f4999-5f33-4830-b2b6-b5e425fb07cf';

  const trips = [
    {
      id: crypto.randomUUID(),
      agent_id: phuongTrangId,
      bus_class: 'SLEEPER',
      departure_time: '06:00:00',
      departure_station_id: myDinhId,
      arrival_time: '18:00:00',
      arrival_station_id: phamNguLaoId,
      duration: '36h 00m',
      base_price: 850000,
      points_earned: 85
    },
    {
      id: crypto.randomUUID(),
      agent_id: hoangLongId,
      bus_class: 'VIP',
      departure_time: '19:00:00',
      departure_station_id: myDinhId,
      arrival_time: '07:00:00',
      arrival_station_id: phamNguLaoId,
      duration: '36h 00m',
      base_price: 1200000,
      points_earned: 120
    }
  ];

  for (const t of trips) {
    await prisma.$executeRawUnsafe(`INSERT INTO trips (id, agent_id, bus_class, departure_time, departure_station_id, arrival_time, arrival_station_id, duration, base_price, points_earned, created_at) VALUES ('${t.id}', '${t.agent_id}', '${t.bus_class}', '${t.departure_time}', '${t.departure_station_id}', '${t.arrival_time}', '${t.arrival_station_id}', '${t.duration}', ${t.base_price}, ${t.points_earned}, NOW());`);
  }

  console.log("Trips seeded!");
  await prisma.$disconnect();
}
run().catch(console.error);
