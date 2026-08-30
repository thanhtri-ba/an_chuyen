import "dotenv/config";
import { PrismaClient, SeatClass, BookingStatus, PaymentStatus, TransactionType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning...");
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "tickets","seat_bookings","booking_timelines","payments","bookings","reviews","wallet_transactions","wallets","loyalty","seats","checkpoints","trip_prices","trip_schedules","trips","routes","stations","cities","provinces","bus_agents","promotions","banners" RESTART IDENTITY CASCADE`);
  await prisma.user.deleteMany();
  const hp = await bcrypt.hash("123456", 10);

  await prisma.user.create({ data: { email: "admin@anchuyen.com", password: hp, fullName: "Admin An Chuyen", phone: "0123456789", role: "admin", isPhoneVerified: true, isEmailVerified: true, wallet: { create: { balance: 50000000 } }, loyalty: { create: { points: 5000, tier: "Platinum" } } } });
  const userNames = ["Nguyen Van An", "Tran Thi Binh", "Le Minh Cuong", "Pham Thanh Dung", "Hoang Van Em", "Vu Thi Phuong", "Do Huu Giau", "Bui Thi Hanh", "Ngo Thanh Long", "Ly Thi Kim"];
  const phones = ["0901234567","0912345678","0923456789","0934567890","0945678901","0956789012","0967890123","0978901234","0989012345","0990123456"];
  const emails = ["an@gmail.com","binh@gmail.com","cuong@gmail.com","dung@gmail.com","em@gmail.com","phuong@gmail.com","giau@gmail.com","hanh@gmail.com","long@gmail.com","kim@gmail.com"];
  const wallets = [2500000,850000,4100000,120000,780000,3200000,9500000,560000,1800000,450000];
  const tiers = ["Gold","Silver","Gold","Member","Member","Gold","Platinum","Member","Silver","Member"];
  const points = [1200,450,2100,80,320,1800,5400,250,620,150];
  const users: any[] = [];
  for (let i = 0; i < 10; i++) {
    users.push(await prisma.user.create({ data: { email: emails[i], password: hp, fullName: userNames[i], phone: phones[i], role: "user", isPhoneVerified: true, isEmailVerified: true, wallet: { create: { balance: wallets[i] } }, loyalty: { create: { points: points[i], tier: tiers[i] } } } }));
  }
  console.log("Users: 11");

  const prov = await prisma.province.create({ data: { name: "Viet Nam" } });
  const cnames = ["TP.HCM","Ha Noi","Da Lat","Nha Trang","Vung Tau","Da Nang","Can Tho","Sapa","Hue","Hai Phong"];
  const cpops = [true,true,true,true,true,true,false,false,false,false];
  const cities: any[] = [];
  for (let i = 0; i < cnames.length; i++) {
    cities.push(await prisma.city.create({ data: { name: cnames[i], provinceId: prov.id, isPopular: cpops[i], image: "https://picsum.photos/seed/" + cnames[i].replace(" ","") + "/800/600", subtitle: cnames[i] } }));
  }
  console.log("Cities:", cities.length);

  // One station per city
  const stCoords: Record<string, [number,number]> = {
    "TP.HCM": [10.8143,106.7118], "Ha Noi": [21.0289,105.7788], "Da Lat": [11.9317,108.4431],
    "Nha Trang": [12.2472,109.1837], "Vung Tau": [10.3540,107.0864], "Da Nang": [16.0526,108.1691],
    "Can Tho": [10.0131,105.7661], "Sapa": [22.3364,103.8438], "Hue": [16.4637,107.5909], "Hai Phong": [20.8449,106.6881]
  };
  const stations: any[] = [];
  for (const city of cities) {
    const [lat, lng] = stCoords[city.name] ?? [16.0, 108.0];
    stations.push(await prisma.station.create({ data: { name: "Ben xe " + city.name, cityId: city.id, isPopular: true, latitude: lat, longitude: lng } }));
  }
  console.log("Stations:", stations.length);

  const agentData = [
    ["Phuong Trang",4.8,3245],["Thanh Buoi",4.7,2187],["Kumho Samco",4.6,1920],["Hoang Long",4.5,1543],
    ["Mai Linh",4.3,989],["Hai Van",4.4,1234],["Hung Thanh",4.2,675],["Sao Viet",4.6,1876],
    ["Hoa Mai",4.1,543],["Toan Thang",4.0,412]
  ];
  const agents: any[] = [];
  for (const [name, rating, reviewCount] of agentData) {
    agents.push(await prisma.busAgent.create({ data: { name: name as string, rating: rating as number, reviewCount: reviewCount as number } }));
  }
  console.log("Agents:", agents.length);

  // Routes
  const routeCfg = [
    ["TP.HCM","Da Lat",180000,420,"#0796A8"], ["TP.HCM","Ha Noi",950000,1800,"#1E3A8A"],
    ["TP.HCM","Nha Trang",220000,540,"#9B51E0"], ["TP.HCM","Vung Tau",90000,120,"#27AE60"],
    ["Ha Noi","Sapa",250000,360,"#F2994A"], ["Da Nang","Hue",100000,150,"#8E44AD"],
    ["TP.HCM","Can Tho",120000,210,"#F1C40F"], ["Ha Noi","Hai Phong",110000,120,"#E74C3C"],
  ];
  const allSchedules: any[] = [];
  for (let ri = 0; ri < routeCfg.length; ri++) {
    const [from, to, price, dur, color] = routeCfg[ri];
    const fc = cities.find(c => c.name === from);
    const tc = cities.find(c => c.name === to);
    if (!fc || !tc) continue;
    const route = await prisma.route.create({ data: { departureCityId: fc.id, arrivalCityId: tc.id, isPopular: true, color: color as string, basePrice: price as number, durationMins: dur as number } });
    const trip = await prisma.trip.create({ data: { busAgentId: agents[ri % agents.length].id, routeId: route.id, busClass: ri % 2 === 0 ? SeatClass.EXECUTIVE : SeatClass.ECONOMY } });
    // Only 4 schedules per route (2 past, 2 future)
    for (const day of [-2, -1, 1, 2]) {
      const dep = new Date(); dep.setDate(dep.getDate() + day); dep.setHours(8, 0, 0, 0);
      const arr = new Date(dep.getTime() + (dur as number) * 60000);
      const sch = await prisma.tripSchedule.create({ data: { tripId: trip.id, departureTime: dep, arrivalTime: arr, durationMins: dur as number } });
      await prisma.tripPrice.create({ data: { tripScheduleId: sch.id, seatClass: SeatClass.ECONOMY, price: price as number } });
      // 10 seats — seatNumber must be "T{floor}-{row}{col}" to match the format
      // generated by admin's generate-seats endpoint and expected by the web
      // seat-selection UI (SeatSelectionPage.tsx parseSeatId).
      const seatData: any[] = [];
      for (let s = 1; s <= 5; s++) { seatData.push({ tripScheduleId: sch.id, seatNumber: `T1-${s}A`, status: "AVAILABLE" }); seatData.push({ tripScheduleId: sch.id, seatNumber: `T1-${s}B`, status: "AVAILABLE" }); }
      await prisma.seat.createMany({ data: seatData });
      const ds = stations.find(s => s.cityId === fc.id);
      const as_ = stations.find(s => s.cityId === tc.id);
      if (ds) await prisma.checkpoint.create({ data: { tripScheduleId: sch.id, stationId: ds.id, type: "PICKUP", time: dep } });
      if (as_) await prisma.checkpoint.create({ data: { tripScheduleId: sch.id, stationId: as_.id, type: "DROPOFF", time: arr } });
      allSchedules.push({ sch, price, fc, tc, isPast: day < 0 });
    }
  }
  console.log("Schedules:", allSchedules.length);

  // Bookings
  const past = allSchedules.filter(s => s.isPast);
  let bc = 0;
  for (let i = 0; i < past.length && i < 20; i++) {
    const { sch, price } = past[i];
    const user = users[i % users.length];
    const seat = await prisma.seat.findFirst({ where: { tripScheduleId: sch.id, status: "AVAILABLE" } });
    if (!seat) continue;
    const bk = await prisma.booking.create({ data: { userId: user.id, tripScheduleId: sch.id, status: BookingStatus.COMPLETED, totalAmount: price, passengers: { create: [{ name: user.fullName }] }, timelines: { create: [{ status: BookingStatus.PENDING_PAYMENT }] } } });
    await prisma.seat.update({ where: { id: seat.id }, data: { status: "BOOKED" } });
    await prisma.seatBooking.create({ data: { bookingId: bk.id, seatId: seat.id } });
    await prisma.payment.create({ data: { bookingId: bk.id, method: "WALLET", status: PaymentStatus.PAID, amount: price, transactionId: "TXN" + i + Date.now(), confirmedAt: new Date() } });
    await prisma.walletTransaction.create({ data: { userId: user.id, amount: -price, type: TransactionType.PAYMENT, description: "Dat ve chuyen xe", referenceId: bk.id } });
    bc++;
  }
  console.log("Bookings:", bc);

  await prisma.promotion.createMany({ data: [
    { code: "WELCOME50", title: "Giam 50% chuyen dau", discountPct: 50, maxDiscount: 100000, validUntil: new Date("2027-01-01") },
    { code: "SUMMER30", title: "He ruc ro Giam 30%", discountPct: 30, maxDiscount: 150000, validUntil: new Date("2025-09-30") },
    { code: "BIRTHDAY10", title: "Sinh nhat Giam 10%", discountPct: 10, validUntil: new Date("2026-12-31") },
  ]});
  await prisma.banner.createMany({ data: [
    { title: "Khuyen mai He 2025", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80", platform: "all", isActive: true },
  ]});

  console.log("DONE!");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
