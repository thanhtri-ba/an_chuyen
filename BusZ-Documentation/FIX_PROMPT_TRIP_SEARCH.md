# Fix Prompt: Trip Search Returns 0 Results - "Antigravity Fix"

## Problem Statement
Search query for HCM → Nha Trang returns "Tìm thấy 0 chuyến xe" (0 trips found), blocking entire booking workflow. This is the critical "antigravity" issue - everything related to bookings floats away because there's no foundation data.

---

## Root Cause Investigation Checklist

### 1. Database Level
```sql
-- Check if any trip data exists at all
SELECT COUNT(*) FROM trip_schedules;
SELECT * FROM trip_schedules LIMIT 5;

-- Check if there's data for specific route
SELECT * FROM trip_schedules 
WHERE departure_city LIKE '%Hồ Chí Minh%' 
  OR departure_city LIKE '%HCM%'
ORDER BY departure_time DESC;

-- Check if routes table exists and has data
SELECT * FROM routes LIMIT 10;

-- Check if pickup/dropoff points exist
SELECT * FROM pickup_dropoff_points LIMIT 10;

-- Verify seats table
SELECT * FROM seats LIMIT 10;
SELECT COUNT(*) FROM seats;
```

### 2. API Level
```bash
# Test the trips API endpoint directly
curl "https://d792eb24.anchuyen-12.pages.dev/api/trip-schedules?departureCity=Thành phố Hồ Chí Minh&destinationCity=Nha Trang&date=2026-08-14"

# Expected response:
# {
#   "success": true,
#   "data": [
#     {
#       "id": "...",
#       "departureCity": "Thành phố Hồ Chí Minh",
#       "destinationCity": "Nha Trang",
#       "departureTime": "08:00",
#       "arrivalTime": "14:00",
#       "price": 350000,
#       "availableSeats": 20,
#       ...
#     }
#   ]
# }

# Check if any trips exist for any route
curl "https://d792eb24.anchuyen-12.pages.dev/api/trip-schedules?limit=100"
```

### 3. Backend Code Review
Check these files:
- `src/trip-schedule/trip-schedule.service.ts` - Query logic
- `src/trip-schedule/trip-schedule.controller.ts` - Route handler
- `src/prisma/schema.prisma` - Schema definition for TripSchedule

Look for:
- Filter logic (is it filtering correctly?)
- Date format matching (2026-08-14 vs "2026-08-14" vs timestamp?)
- City name matching (exact string vs LIKE vs ID matching?)
- Query join logic (fetching related seats data?)

### 4. Frontend Level
Check `src/pages/SearchPage.tsx`:
- Are query parameters being sent correctly?
- Are city names being sent as full names or IDs?
- Is date format correct (MM/DD/YYYY vs YYYY-MM-DD)?

---

## Fix Solutions (in priority order)

### Solution 1: ADD TEST TRIP DATA (QUICKEST FIX - 10 minutes)

```sql
-- Insert test routes first (if not exists)
INSERT INTO routes (id, name, distance_km, estimated_duration_hours) VALUES
('route_hcm_nha_trang', 'TP.HCM - Nha Trang', 450, 10),
ON CONFLICT DO NOTHING;

-- Insert test buses
INSERT INTO buses (id, bus_name, bus_number, total_seats, amenities) VALUES
('bus_001', 'Express Bus HCM-Nha Trang', 'BUS-001', 40, 'AC,Wifi,Toilet'),
('bus_002', 'Deluxe Bus HCM-Nha Trang', 'BUS-002', 32, 'AC,Wifi,Toilet,Reclining'),
ON CONFLICT DO NOTHING;

-- Insert test trip schedules
INSERT INTO trip_schedules (
  id, route_id, bus_id, departure_city, destination_city,
  departure_time, arrival_time, departure_date, price,
  status, created_at
) VALUES
('trip_001', 'route_hcm_nha_trang', 'bus_001', 'Thành phố Hồ Chí Minh', 'Nha Trang', 
 '08:00:00', '14:00:00', '2026-08-11', 350000, 'active', NOW()),
('trip_002', 'route_hcm_nha_trang', 'bus_002', 'Thành phố Hồ Chí Minh', 'Nha Trang',
 '10:00:00', '16:00:00', '2026-08-11', 420000, 'active', NOW()),
('trip_003', 'route_hcm_nha_trang', 'bus_001', 'Thành phố Hồ Chí Minh', 'Nha Trang',
 '14:00:00', '20:00:00', '2026-08-11', 300000, 'active', NOW()),
('trip_004', 'route_hcm_nha_trang', 'bus_002', 'Thành phố Hồ Chí Minh', 'Nha Trang',
 '20:00:00', '06:00:00', '2026-08-12', 280000, 'active', NOW()),
ON CONFLICT DO NOTHING;

-- Insert seats for each trip
-- For trip_001: 40 seats (bus has 40 seats)
INSERT INTO seats (trip_schedule_id, seat_number, seat_position, is_available, price)
SELECT 'trip_001', num, 'T1-' || num, true, 350000
FROM generate_series(1, 40) AS num
ON CONFLICT DO NOTHING;

-- Similar for other trips...
```

### Solution 2: DEBUG TRIP SEARCH API

Create new file: `src/debug/test-trip-search.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugTripSearch() {
  console.log('=== Trip Search Debug ===\n');

  // 1. Count total trips
  const totalTrips = await prisma.tripSchedule.count();
  console.log(`Total trips in DB: ${totalTrips}`);

  // 2. List all trips
  const allTrips = await prisma.tripSchedule.findMany({
    select: {
      id: true,
      departureCityName: true,
      destinationCityName: true,
      departureDate: true,
      departureTime: true,
      status: true,
    },
    take: 20,
  });
  console.log('\nAll trips:');
  console.table(allTrips);

  // 3. Test specific search
  const hcmNhaTrangTrips = await prisma.tripSchedule.findMany({
    where: {
      AND: [
        {
          OR: [
            { departureCityName: { contains: 'Hồ Chí Minh' } },
            { departureCityName: 'HCM' },
          ],
        },
        { destinationCityName: { contains: 'Nha Trang' } },
        { departureDate: '2026-08-14' },
      ],
    },
  });
  console.log('\nHCM→Nha Trang on 2026-08-14:');
  console.table(hcmNhaTrangTrips);

  // 4. Test without filters
  const noFilterTrips = await prisma.tripSchedule.findMany({
    where: {
      departureCityName: { contains: 'Hồ Chí Minh' },
    },
  });
  console.log('\nTrips from HCM (any destination):');
  console.table(noFilterTrips);

  await prisma.$disconnect();
}

debugTripSearch();
```

Run: `npx ts-node src/debug/test-trip-search.ts`

### Solution 3: FIX TRIP SEARCH QUERY

File: `src/trip-schedule/trip-schedule.service.ts`

```typescript
async searchTrips(searchDto: SearchTripDto): Promise<TripSchedule[]> {
  const { departureCity, destinationCity, departureDate, passengers } = searchDto;

  console.log('Search params:', { departureCity, destinationCity, departureDate });

  // ISSUE: Check if these values are actually being used
  // FIX: Normalize city names and date format
  
  const normalizedDeparture = departureCity?.trim().toLowerCase();
  const normalizedDestination = destinationCity?.trim().toLowerCase();
  const formattedDate = departureDate ? new Date(departureDate).toISOString().split('T')[0] : null;

  console.log('Normalized:', { normalizedDeparture, normalizedDestination, formattedDate });

  // If still 0 results, check individual conditions
  const trips = await this.prisma.tripSchedule.findMany({
    where: {
      AND: [
        normalizedDeparture ? {
          departureCityName: {
            contains: normalizedDeparture,
            mode: 'insensitive',
          },
        } : {},
        
        normalizedDestination ? {
          destinationCityName: {
            contains: normalizedDestination,
            mode: 'insensitive',
          },
        } : {},
        
        formattedDate ? {
          departureDate: formattedDate,
        } : {},
        
        {
          status: 'active',
        },
      ],
    },
    include: {
      seats: {
        where: { isAvailable: true },
      },
      bus: true,
    },
    orderBy: { departureTime: 'asc' },
  });

  console.log(`Found ${trips.length} trips`);
  return trips;
}
```

### Solution 4: CHECK CITY NAME MAPPING

File: `src/locations/cities.service.ts`

```typescript
// Make sure city names match exactly between frontend and database
const CITY_MAPPING = {
  'Thành phố Hồ Chí Minh': 'HCM', // Database key
  'HCM': 'HCM',
  'ho chi minh': 'HCM',
  'Nha Trang': 'NHA_TRANG',
  'nha trang': 'NHA_TRANG',
};

// Update search to use normalized city IDs
async searchTrips(departureCity: string, destinationCity: string, date: string) {
  const departureCityId = CITY_MAPPING[departureCity.toLowerCase()];
  const destinationCityId = CITY_MAPPING[destinationCity.toLowerCase()];
  
  if (!departureCityId || !destinationCityId) {
    throw new BadRequestException('Invalid city names');
  }
  
  // Now search using city IDs instead of names
  return this.prisma.tripSchedule.findMany({
    where: {
      departureCityId,
      destinationCityId,
      departureDate: date,
    },
  });
}
```

---

## Implementation Steps

### Step 1: Quick Fix (Add Test Data)
```bash
# Connect to Supabase or your database
psql $DATABASE_URL < test_trips.sql

# Or use Prisma seed
npx prisma db seed
```

Create file: `prisma/seed.ts`
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.seat.deleteMany({});
  await prisma.tripSchedule.deleteMany({});
  await prisma.bus.deleteMany({});

  // Add test data (see SQL above)
  console.log('Test data inserted');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
```

Run: `npx prisma db seed`

### Step 2: Debug
```bash
npx ts-node src/debug/test-trip-search.ts
```

### Step 3: Review API Response
```bash
curl "http://localhost:3000/api/trip-schedules?departureCity=Thành+phố+Hồ+Chí+Minh&destinationCity=Nha+Trang&date=2026-08-11"
```

### Step 4: Test Frontend Again
Repeat search on website with test data

### Step 5: If Still 0 Results
Enable SQL logging in `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  
  // Add this:
  // redirectUrl = env("DATABASE_REDIRECT_URL")
}
```

Set `DEBUG=prisma:*` and check SQL queries being generated

---

## Expected Results After Fix

✅ Search for HCM → Nha Trang should return trips  
✅ Trips display with times, prices, available seats  
✅ User can click to select seats  
✅ Can proceed to payment flow  
✅ Can complete booking  
✅ Admin can see pending payments  

---

## Testing Checklist After Fix

- [ ] Search returns trips (not 0)
- [ ] Trip list shows departure/arrival times
- [ ] Trip list shows correct prices
- [ ] "Chọn ghế" (Select seats) button clickable
- [ ] Clicking opens seat selection page
- [ ] Seats display correctly
- [ ] Payment method selection works
- [ ] COD payment flow completes
- [ ] Admin sees pending payment

---

## Fallback: If Database is Actually Empty

If the database genuinely has NO trip data at all, you need to:

1. **Create migration** to add seed data
2. **Or manually insert** test records
3. **Or import** from production database if available
4. **Or create** trip data entry UI in admin panel

Quick workaround for testing:
```sql
INSERT INTO trip_schedules VALUES (...);
INSERT INTO seats SELECT * FROM ...;
```

Then re-run tests.

---

## Success Criteria

✅ **PASS**: Search returns ≥1 trip for HCM→Nha Trang  
✅ **PASS**: Trip has valid times, price, available seats  
✅ **PASS**: Seat selection page loads and shows seats  
✅ **PASS**: Payment flow accessible  
✅ **PASS**: Can create booking with payment record  

---

*This is the "antigravity fix" - we're grounding the system with real data so bookings don't float away into the void.*
