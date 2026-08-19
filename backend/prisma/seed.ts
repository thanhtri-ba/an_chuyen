import 'dotenv/config';
import { PrismaClient, SeatClass } from '@prisma/client';
import process from 'process';
import bcrypt from 'bcryptjs';

const dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL || '';
const urlWithLimit = dbUrl.includes('connection_limit') 
  ? dbUrl.replace(/connection_limit=\d+/, 'connection_limit=1')
  : (dbUrl.includes('?') ? `${dbUrl}&connection_limit=1` : `${dbUrl}?connection_limit=1`);

const prisma = new PrismaClient({
  datasources: { db: { url: urlWithLimit } }
});

async function main() {
  console.log('Starting seed...');
  console.log('Cleaning up existing data...');
  await prisma.ticket.deleteMany();
  await prisma.seatBooking.deleteMany();
  await prisma.bookingTimeline.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.user.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.tripPrice.deleteMany();
  await prisma.tripSchedule.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.route.deleteMany();
  await prisma.station.deleteMany();
  await prisma.city.deleteMany();
  await prisma.province.deleteMany();
  await prisma.busAgent.deleteMany();
  await prisma.promotion.deleteMany();

  // 1. Create User & Wallet
  const hashedPassword = await bcrypt.hash('123456', 10);
  const user = await prisma.user.create({
    data: {
      email: 'admin@anchuyen.com',
      password: hashedPassword,
      fullName: 'Admin An Chuyến',
      phone: '0123456789',
      role: 'admin',
      wallet: {
        create: { balance: 1000000 },
      },
      loyalty: {
        create: { points: 500, tier: 'Gold' },
      },
    },
  });
  console.log('Created user:', user.email);

  // 2. Create Location Data
  const province = await prisma.province.create({
    data: { name: 'Việt Nam' },
  });
  const cityConfigs = [
    { name: 'TP.HCM', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80', sub: 'Thành phố mang tên Bác', isPopular: true },
    { name: 'Hà Nội', image: 'https://th.bing.com/th/id/OSK.HEROTLgG5nFJXCKnlW0a2GaB2FKdEVVg8kqGnr9xmOklJj4?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3', sub: 'Thủ đô ngàn năm', isPopular: true },
    { name: 'Đà Lạt', image: 'https://static.vinwonders.com/production/da-lat-vietnam-banner.jpg', sub: 'Thành phố ngàn hoa', isPopular: true },
    { name: 'Nha Trang', image: 'https://vietnamreviewer.com/wp-content/uploads/2025/01/Nha-Trang-to-Vung-Tau.jpeg', sub: 'Biển xanh ngọc bích', isPopular: true },
    { name: 'Vũng Tàu', image: 'https://swagathresorts.com/wp-content/uploads/2021/08/vung-tau-o-dau.jpg', sub: 'Thành phố biển', isPopular: true },
    { name: 'Đà Nẵng', image: 'https://a.cdn-hotels.com/gdcs/production126/d1337/a4fd6b39-16b6-4230-bcf1-155a0d9a72c1.jpg', sub: 'Thành phố đáng sống', isPopular: true },
    { name: 'Cần Thơ', image: 'https://tse1.mm.bing.net/th/id/OIP.Ph5ZXVEAKj0OC1CRp96n-AHaEW?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', sub: 'Xứ Tây Đô', isPopular: false },
    { name: 'Sapa', image:'https://tse2.mm.bing.net/th/id/OIP.fkagTKFfO5iW-5KXUeCoBAHaEo?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', sub: 'Thành phố trong sương', isPopular: false },
    { name: 'Hội An', image: 'https://www.agoda.com/wp-content/uploads/2024/05/hoi-an.jpg', sub: 'Phố cổ trầm mặc', isPopular: false },
    { name: 'Phú Quốc', image: 'https://tse2.mm.bing.net/th/id/OIP.ag6C4a8BHZ0b1lywLMPahwHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', sub: 'Đảo Ngọc', isPopular: false },
    { name: 'Hải Phòng', image: 'https://picsum.photos/seed/haiphong-vn/800/600', sub: 'Thành phố Hoa phượng đỏ', isPopular: false },
    { name: 'Hạ Long', image: 'https://picsum.photos/seed/halong-vn/800/600', sub: 'Kỳ quan thế giới', isPopular: false },
    { name: 'Huế', image: 'https://picsum.photos/seed/hue-vn/800/600', sub: 'Cố đô cổ kính', isPopular: false },
    { name: 'Ninh Bình', image: 'https://picsum.photos/seed/ninhbinh-vn/800/600', sub: 'Vịnh Hạ Long trên cạn', isPopular: false },
    { name: 'Buôn Ma Thuột', image: 'https://picsum.photos/seed/buonmathuot-vn/800/600', sub: 'Thủ phủ cà phê', isPopular: false },
  ];
  const cities = [];
  for (const c of cityConfigs) {
    const city = await prisma.city.create({ data: { name: c.name, provinceId: province.id, isPopular: c.isPopular, image: c.image, subtitle: c.sub } });
    cities.push(city);
  }
  console.log(`Created ${cities.length} cities`);

  // Real Stations Data (Southern Vietnam)
  const realStations = [
    { cityName: 'TP.HCM', name: 'Bến xe Miền Đông', lat: 10.8143, lng: 106.7118, isPopular: true },
    { cityName: 'TP.HCM', name: 'Bến xe Miền Tây', lat: 10.7351, lng: 106.6186, isPopular: true },
    { cityName: 'TP.HCM', name: 'Bến xe An Sương', lat: 10.8358, lng: 106.6133, isPopular: true },
    { cityName: 'TP.HCM', name: 'Bến xe Ngã Tư Ga', lat: 10.8601, lng: 106.6785, isPopular: false },
    { cityName: 'Vũng Tàu', name: 'Bến xe Vũng Tàu', lat: 10.3540, lng: 107.0864, isPopular: true },
    { cityName: 'Vũng Tàu', name: 'Bến xe Bà Rịa', lat: 10.4934, lng: 107.1703, isPopular: false },
    { cityName: 'Đà Lạt', name: 'Bến xe Liên Tỉnh Đà Lạt', lat: 11.9317, lng: 108.4431, isPopular: true },
    { cityName: 'Nha Trang', name: 'Bến xe Phía Nam Nha Trang', lat: 12.2472, lng: 109.1837, isPopular: true },
    { cityName: 'Nha Trang', name: 'Bến xe Phía Bắc Nha Trang', lat: 12.2783, lng: 109.1969, isPopular: false },
    { cityName: 'Cần Thơ', name: 'Bến xe Trung Tâm Cần Thơ', lat: 10.0131, lng: 105.7661, isPopular: true },
    { cityName: 'Đà Nẵng', name: 'Bến xe Trung Tâm Đà Nẵng', lat: 16.0526, lng: 108.1691, isPopular: true },
    { cityName: 'Hà Nội', name: 'Bến xe Mỹ Đình', lat: 21.0289, lng: 105.7788, isPopular: true },
    { cityName: 'Hà Nội', name: 'Bến xe Giáp Bát', lat: 20.9841, lng: 105.8427, isPopular: true },
    { cityName: 'Hà Nội', name: 'Bến xe Nước Ngầm', lat: 20.9634, lng: 105.8458, isPopular: false },
  ];

  let stationCount = 0;
  for (const city of cities) {
    const cityStations = realStations.filter(s => s.cityName === city.name);
    
    // Create real stations if they exist for this city
    for (const rs of cityStations) {
      await prisma.station.create({
        data: {
          name: rs.name,
          cityId: city.id,
          isPopular: rs.isPopular,
          latitude: rs.lat,
          longitude: rs.lng,
        },
      });
      stationCount++;
    }
    
    // Fill the rest with dummy stations if no real ones (to avoid breaking relations in routes/trips)
    if (cityStations.length === 0) {
      for (let i = 1; i <= 2; i++) {
        await prisma.station.create({
          data: {
            name: `Bến xe ${city.name} ${i}`,
            cityId: city.id,
            isPopular: i === 1,
            // dummy lat/lng around the city center
            latitude: 10.0 + (Math.random() * 5),
            longitude: 105.0 + (Math.random() * 5),
          },
        });
        stationCount++;
      }
    }
  }
  console.log(`Created ${stationCount} stations`);

  // 3. Create Bus Agents (10 total)
  const agentNames = ['Phương Trang', 'Thành Bưởi', 'Kumho Samco', 'Hoàng Long', 'Mai Linh', 'Hải Vân', 'Hưng Thành', 'Sao Việt', 'Hoa Mai', 'Toàn Thắng'];
  const agents = [];
  for (const name of agentNames) {
    const agent = await prisma.busAgent.create({
      data: { name, rating: 4.8, reviewCount: 120 },
    });
    agents.push(agent);
  }
  console.log(`Created ${agents.length} bus agents`);

  // 4. Create Routes
  const routeConfigs = [
    { from: 'TP.HCM', to: 'Đà Lạt', price: 180000, duration: 420, color: '#0796A8', isPopular: true },
    { from: 'TP.HCM', to: 'Hà Nội', price: 950000, duration: 1800, color: '#1E3A8A', isPopular: true },
    { from: 'TP.HCM', to: 'Nha Trang', price: 220000, duration: 540, color: '#9B51E0', isPopular: true },
    { from: 'TP.HCM', to: 'Vũng Tàu', price: 90000, duration: 120, color: '#27AE60', isPopular: true },
    { from: 'Hà Nội', to: 'Sapa', price: 250000, duration: 360, color: '#F2994A', isPopular: true },
  ];

  for (const rc of routeConfigs) {
    const fromCity = cities.find(c => c.name === rc.from);
    const toCity = cities.find(c => c.name === rc.to);
    
    if (fromCity && toCity) {
      const route = await prisma.route.create({
        data: {
          departureCityId: fromCity.id,
          arrivalCityId: toCity.id,
          isPopular: rc.isPopular,
          color: rc.color,
          basePrice: rc.price,
          durationMins: rc.duration,
        },
      });

      // Create 2 trips per route
      for (let i = 0; i < 2; i++) {
        const trip = await prisma.trip.create({
          data: {
            busAgentId: agents[i % agents.length].id,
            routeId: route.id,
            busClass: SeatClass.EXECUTIVE,
          },
        });

        // Create 2 trips per route (i = 0 is today, i = 1 is tomorrow)
        let depTime = new Date();
        depTime.setHours(i === 0 ? 10 : 14, 0, 0, 0); // 10:00 AM today, 14:00 PM tomorrow
        depTime = new Date(depTime.getTime() + 24 * 60 * 60 * 1000 * i);
        
        let arrTime = new Date(depTime.getTime() + rc.duration * 60 * 1000);

        const schedule = await prisma.tripSchedule.create({
          data: {
            tripId: trip.id,
            departureTime: depTime,
            arrivalTime: arrTime,
            durationMins: rc.duration,
          },
        });
        
        await prisma.tripPrice.create({
          data: {
            tripScheduleId: schedule.id,
            seatClass: SeatClass.ECONOMY,
            price: rc.price,
          }
        });

        // Create 6 seats per schedule
        for (let s = 1; s <= 6; s++) {
          await prisma.seat.create({
            data: {
              tripScheduleId: schedule.id,
              seatNumber: `A${s}`,
            },
          });
        }
      }
    }
  }
  console.log('Created routes, trips and seats');

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
