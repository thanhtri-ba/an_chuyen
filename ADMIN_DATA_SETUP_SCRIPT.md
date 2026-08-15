# Quick Data Setup - Instead of Manual Admin UI

The admin UI requires too many dependent entities (provinces → cities → routes → buses → trips). Here are **4 fast methods**:

---

## Method 1: Direct Database Insertion (FASTEST - 2 mins)

Connect to Supabase/PostgreSQL and run:

```sql
-- 1. Add Cities (might need provinces first, or use NULL/0)
INSERT INTO cities (id, name, province, subtitle, image_url) VALUES
('city_hcm', 'Ho Chi Minh City', 'Ho Chi Minh', 'Largest city in Vietnam', 'https://example.com/hcm.jpg'),
('city_nha_trang', 'Nha Trang', 'Khanh Hoa', 'Beach destination', 'https://example.com/nha_trang.jpg'),
('city_da_lat', 'Da Lat', 'Lam Dong', 'City of Eternal Spring', 'https://example.com/dalat.jpg'),
('city_da_nang', 'Da Nang', 'Da Nang', 'Coastal city in central Vietnam', 'https://example.com/danang.jpg'),
('city_ha_noi', 'Ha Noi', 'Ha Noi', 'Capital of Vietnam', 'https://example.com/hanoi.jpg')
ON CONFLICT DO NOTHING;

-- 2. Add Routes
INSERT INTO routes (id, departure_city_id, arrival_city_id, distance_km, duration_mins, base_price) VALUES
('route_hcm_nhat', 'city_hcm', 'city_nha_trang', 450, 600, 350000),
('route_hcm_dalat', 'city_hcm', 'city_da_lat', 300, 480, 250000),
('route_danang_hanoi', 'city_da_nang', 'city_ha_noi', 766, 960, 400000)
ON CONFLICT DO NOTHING;

-- 3. Add Buses
INSERT INTO buses (id, bus_number, bus_name, total_seats, bus_type, amenities) VALUES
('bus_001', 'BUS-001', 'Express Bus HCM-NhaTrang', 40, 'Express', 'AC,WiFi,Toilet'),
('bus_002', 'BUS-002', 'Sleeper Bus HCM-DaLat', 34, 'Sleeper', 'AC,WiFi,Blanket'),
('bus_003', 'BUS-003', 'Luxury DaNang-HaNoi', 22, 'Limousine', 'AC,WiFi,Massage Seats,Food')
ON CONFLICT DO NOTHING;

-- 4. Add Trips
INSERT INTO trip_schedules (
  id, route_id, bus_id, departure_date, departure_time, 
  arrival_time, price, status, created_at
) VALUES
('trip_001', 'route_hcm_nhat', 'bus_001', '2026-08-11', '08:00:00', '14:00:00', 350000, 'active', NOW()),
('trip_002', 'route_hcm_dalat', 'bus_002', '2026-08-11', '22:00:00', '06:00:00', 250000, 'active', NOW()),
('trip_003', 'route_danang_hanoi', 'bus_003', '2026-08-12', '18:00:00', '10:00:00', 400000, 'active', NOW())
ON CONFLICT DO NOTHING;

-- 5. Add Seats for the trips
INSERT INTO seats (trip_schedule_id, seat_number, is_available, price)
SELECT 'trip_001', 'A' || generate_series(1, 40), true, 350000
ON CONFLICT DO NOTHING;

INSERT INTO seats (trip_schedule_id, seat_number, is_available, price)
SELECT 'trip_002', 'B' || generate_series(1, 34), true, 250000
ON CONFLICT DO NOTHING;

INSERT INTO seats (trip_schedule_id, seat_number, is_available, price)
SELECT 'trip_003', 'L' || generate_series(1, 22), true, 400000
ON CONFLICT DO NOTHING;

-- 6. (Optional) Add a test booking
INSERT INTO bookings (
  id, trip_schedule_id, user_id, booking_date, 
  total_price, status, created_at
) VALUES
('booking_001', 'trip_001', 'user_id_here', '2026-08-10', 350000, 'confirmed', NOW())
ON CONFLICT DO NOTHING;

-- 7. (Optional) Add test payment
INSERT INTO payments (
  id, booking_id, payment_method, payment_status, 
  amount, currency, created_at
) VALUES
('payment_001', 'booking_001', 'COD', 'pending', 350000, 'VND', NOW())
ON CONFLICT DO NOTHING;
```

**Run this in:**
- Supabase: SQL Editor
- PgAdmin: Query tool  
- psql CLI: `psql -d "your_db_url" -f script.sql`

---

## Method 2: API Calls (cURL)

If you have API endpoints, use curl:

```bash
# 1. Create Route (Example: HCM - Da Lat)
curl -X POST https://an-chuyen.pages.dev/api/routes \
  -H "Content-Type: application/json" \
  -d '{
    "departureCityId": "city_hcm",
    "arrivalCityId": "city_da_lat",
    "basePrice": 250000,
    "durationMins": 480
  }'

# 2. Create Bus
curl -X POST https://an-chuyen.pages.dev/api/buses \
  -H "Content-Type: application/json" \
  -d '{
    "busNumber": "BUS-002",
    "busName": "Sleeper HCM-DaLat",
    "totalSeats": 34,
    "amenities": "AC,WiFi,Blanket"
  }'

# 3. Create Trip
curl -X POST https://an-chuyen.pages.dev/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "routeId": "route_hcm_dalat",
    "busId": "bus_002",
    "departureDate": "2026-08-11",
    "departureTime": "22:00",
    "arrivalTime": "06:00",
    "price": 250000
  }'
```

---

## Method 3: TypeScript/Node Seed Script

```typescript
// seed.ts - Run with `npx ts-node seed.ts`

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Cities
  await prisma.city.createMany({
    data: [
      { id: 'city_hcm', name: 'Ho Chi Minh City', province: 'Ho Chi Minh', subtitle: 'Largest city' },
      { id: 'city_nha_trang', name: 'Nha Trang', province: 'Khanh Hoa', subtitle: 'Beach destination' },
      { id: 'city_da_lat', name: 'Da Lat', province: 'Lam Dong', subtitle: 'City of Eternal Spring' },
      { id: 'city_da_nang', name: 'Da Nang', province: 'Da Nang', subtitle: 'Coastal city' },
      { id: 'city_ha_noi', name: 'Ha Noi', province: 'Ha Noi', subtitle: 'Capital' },
    ],
    skipDuplicates: true,
  });

  // Routes
  await prisma.route.createMany({
    data: [
      { id: 'route_hcm_nhat', departureCityId: 'city_hcm', arrivalCityId: 'city_nha_trang', distanceKm: 450, durationMins: 600, basePrice: 350000 },
      { id: 'route_hcm_dalat', departureCityId: 'city_hcm', arrivalCityId: 'city_da_lat', distanceKm: 300, durationMins: 480, basePrice: 250000 },
      { id: 'route_danang_hanoi', departureCityId: 'city_da_nang', arrivalCityId: 'city_ha_noi', distanceKm: 766, durationMins: 960, basePrice: 400000 },
    ],
    skipDuplicates: true,
  });

  // Buses
  await prisma.bus.createMany({
    data: [
      { id: 'bus_001', busNumber: 'BUS-001', busName: 'Express HCM-NhaTrang', totalSeats: 40, amenities: 'AC,WiFi,Toilet' },
      { id: 'bus_002', busNumber: 'BUS-002', busName: 'Sleeper HCM-DaLat', totalSeats: 34, amenities: 'AC,WiFi,Blanket' },
      { id: 'bus_003', busNumber: 'BUS-003', busName: 'Luxury DaNang-HaNoi', totalSeats: 22, amenities: 'AC,WiFi,Massage Seats' },
    ],
    skipDuplicates: true,
  });

  // Trips
  await prisma.tripSchedule.createMany({
    data: [
      { id: 'trip_001', routeId: 'route_hcm_nhat', busId: 'bus_001', departureDate: new Date('2026-08-11'), departureTime: '08:00', arrivalTime: '14:00', price: 350000, status: 'active' },
      { id: 'trip_002', routeId: 'route_hcm_dalat', busId: 'bus_002', departureDate: new Date('2026-08-11'), departureTime: '22:00', arrivalTime: '06:00', price: 250000, status: 'active' },
      { id: 'trip_003', routeId: 'route_danang_hanoi', busId: 'bus_003', departureDate: new Date('2026-08-12'), departureTime: '18:00', arrivalTime: '10:00', price: 400000, status: 'active' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Test data created successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## Method 4: Python Script (Alternative for Bulk API calls)

If you want to automate API calls dynamically from a CSV or list, you can use Python:

```python
# seed_api.py - Run with `python seed_api.py` (requires requests: pip install requests)
import requests
import json

BASE_URL = "https://an-chuyen.pages.dev/api"
HEADERS = {"Content-Type": "application/json"}

# Add Route
route_data = {
    "departureCityId": "city_da_nang",
    "arrivalCityId": "city_ha_noi",
    "basePrice": 400000,
    "durationMins": 960
}
res = requests.post(f"{BASE_URL}/routes", headers=HEADERS, data=json.dumps(route_data))
print("Route Response:", res.status_code)

# Add Bus
bus_data = {
    "busNumber": "BUS-003",
    "busName": "Luxury DaNang-HaNoi",
    "totalSeats": 22,
    "amenities": "AC,WiFi,Food"
}
res = requests.post(f"{BASE_URL}/buses", headers=HEADERS, data=json.dumps(bus_data))
print("Bus Response:", res.status_code)
```

---

## Recommendation

**Use Method 1 (SQL)** - Fastest and most direct:
1. Copy SQL from above
2. Run in Supabase SQL Editor or psql
3. Takes <1 minute
4. Immediately test search in UI

---

## After Setup: Re-test Search

Once data is created:
1. Go to https://d792eb24.anchuyen-12.pages.dev/
2. Search: 
   - HCM → Nha Trang, 2026-08-11
   - HCM → Da Lat, 2026-08-11
   - Da Nang → Ha Noi, 2026-08-12
3. Should see matching trips instead of "0 trips"
4. Proceed with seat selection, payment, etc.

---

This beats clicking through admin UI with 10+ form fills! 🚀
