"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting seed...');
    // 1. Create User & Wallet
    const user = await prisma.user.create({
        data: {
            email: 'admin@busz.com',
            fullName: 'Admin BusZ',
            wallet: {
                create: { balance: 1000000 },
            },
            loyalty: {
                create: { points: 500, tier: 'Gold' },
            },
        },
    });
    console.log('Created user:', user.email);
    // 2. Create Location Data (20 Cities, 100 Stations - sample subset here for speed)
    const province = await prisma.province.create({
        data: { name: 'Jawa' },
    });
    const cityNames = ['Jakarta', 'Surabaya', 'Bandung', 'Yogyakarta', 'Semarang', 'Malang', 'Solo', 'Cirebon', 'Bogor', 'Depok', 'Tangerang', 'Bekasi', 'Bali', 'Denpasar', 'Kuta', 'Ubud', 'Makassar', 'Medan', 'Palembang', 'Padang'];
    const cities = await Promise.all(cityNames.map((name) => prisma.city.create({ data: { name, provinceId: province.id } })));
    console.log(`Created ${cities.length} cities`);
    // Create 5 stations per city (100 total)
    let stationCount = 0;
    for (const city of cities) {
        for (let i = 1; i <= 5; i++) {
            await prisma.station.create({
                data: {
                    name: `Terminal ${city.name} ${i}`,
                    cityId: city.id,
                    isPopular: i === 1, // First station is popular
                },
            });
            stationCount++;
        }
    }
    console.log(`Created ${stationCount} stations`);
    // 3. Create Bus Agents (10 total)
    const agentNames = ['Cititrans', 'DayTrans', 'Agra Mas', 'Kramat Djati', 'Pahala Kencana', 'Lorena', 'Sinar Jaya', 'Gunung Harta', 'Harapan Jaya', 'Rosalia Indah'];
    const agents = await Promise.all(agentNames.map((name) => prisma.busAgent.create({
        data: { name, rating: 4.8, reviewCount: 120 },
    })));
    console.log(`Created ${agents.length} bus agents`);
    // 4. Create Route & Trips (50 Trips)
    const route = await prisma.route.create({
        data: {
            departureCityId: cities[0].id, // Jakarta
            arrivalCityId: cities[3].id, // Yogyakarta
        },
    });
    for (let i = 0; i < 50; i++) {
        const trip = await prisma.trip.create({
            data: {
                busAgentId: agents[i % agents.length].id,
                routeId: route.id,
                busClass: 'EXECUTIVE',
            },
        });
        const schedule = await prisma.tripSchedule.create({
            data: {
                tripId: trip.id,
                departureTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * i), // +i days
                arrivalTime: new Date(new Date().getTime() + 36 * 60 * 60 * 1000 * i),
                durationMins: 720,
            },
        });
        // Create 6 seats per schedule (300 seats total across 50 schedules)
        for (let s = 1; s <= 6; s++) {
            await prisma.seat.create({
                data: {
                    tripScheduleId: schedule.id,
                    seatNumber: `A${s}`,
                },
            });
        }
    }
    console.log('Created 50 trips and 300 seats');
    // 5. Create Promotions
    await prisma.promotion.create({
        data: {
            code: 'WELCOME50',
            title: '50% Off First Ride',
            discountPct: 50.0,
            validUntil: new Date('2027-01-01'),
        },
    });
    console.log('Created promotions');
    console.log('Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
