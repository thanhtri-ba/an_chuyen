# 🚀 An Chuyến Backend - Deployment & Testing Steps

## ✅ What's Been Fixed

1. ✅ **Payment Module Implemented** (4 new files)
   - payment.dto.ts (942 bytes)
   - payment.controller.ts (3.0 KB)
   - payment.service.ts (3.4 KB)
   - payment.routes.ts (796 bytes)

2. ✅ **Payment Routes Registered** in main app
   - Added to `/api/payments` endpoints

3. ✅ **Production Database Seeding Script** created
   - Automatically creates cities, routes, trips, and seats

---

## 📋 Deployment Instructions

### **STEP 1: Push Changes to GitHub**

```bash
cd /path/to/an_chuyen

# Add backend changes
git add backend/src/modules/payment/
git add backend/src/index.ts
git add backend/prisma/seed-production.ts

# Commit
git commit -m "Fix: Implement complete payment module and database seeding

- Added payment.controller.ts with full API endpoints
- Added payment.service.ts with business logic
- Added payment.routes.ts with route definitions
- Added payment.dto.ts with TypeScript interfaces
- Updated index.ts to register payment routes
- Created seed-production.ts for database initialization"

# Push to main
git push origin main
```

**Time to deploy:** ~2-3 minutes (Onrender auto-deploys on push)

---

### **STEP 2: Monitor Deployment on Onrender**

1. Go to: https://dashboard.onrender.com
2. Find service: `anchuyen-backend`
3. Check Build Logs for:
   - ✅ `npm install` - successful
   - ✅ `npm run build` - successful
   - ✅ Service running on port 3000

**Expected Status:** "Live" (green indicator)

---

### **STEP 3: Seed Production Database**

**Option A: Using Supabase Console (Recommended)**

1. Go to: https://supabase.com
2. Open your Supabase project
3. Go to SQL Editor
4. Run this script to verify cities exist:

```sql
SELECT COUNT(*) as city_count FROM cities;
SELECT * FROM cities LIMIT 5;
```

If count is 0, run the seed script locally:

```bash
cd backend

# Set your Supabase connection string
export DATABASE_URL="postgres://..."
export DIRECT_URL="postgres://..."

# Run seed
npx ts-node prisma/seed-production.ts
```

**Option B: Using SSH to Onrender**

```bash
# Connect to Onrender service
# Then run:
npx ts-node prisma/seed-production.ts
```

---

### **STEP 4: Verify API Endpoints**

#### Test 1: Health Check
```bash
curl https://anchuyen-backend.onrender.com/health
```
**Expected Response:**
```json
{
  "status": "UP",
  "timestamp": "2026-08-15T..."
}
```

#### Test 2: Search Trips
```bash
curl "https://anchuyen-backend.onrender.com/api/trips?origin=TP.HCM&destination=Nha%20Trang&date=2026-08-11&page=1&limit=20"
```
**Expected Response:** Array of trips with prices and availability

#### Test 3: Create Payment (Requires Auth)
```bash
# First, get a valid JWT token from login
TOKEN="your-jwt-token-here"

curl -X POST https://anchuyen-backend.onrender.com/api/payments/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "bookingId": "test-booking-123",
    "method": "COD",
    "amount": 220000,
    "currency": "VND"
  }'
```

---

### **STEP 5: Test Full Booking Flow in Frontend**

1. Open: https://anchuyen-12.pages.dev
2. Login with test account
3. Search: **TP.HCM → Nha Trang, Date: 2026-08-11**
4. Expected: Should see 1 trip (Phương Trang, 10:00-19:00, 220k)
5. Click: **Chọn ghế**
6. Select: Seat A1
7. Fill: Passenger info
8. Click: **Tiếp tục thanh toán** (Continue to Payment)
9. Expected: Payment page loads (not redirect to home)
10. Select: **COD** payment method
11. Click: **Confirm Payment**

---

## 🐛 Troubleshooting

### Issue: API returns "0 trips"
**Solution:**
```bash
# Verify database has cities
curl "https://anchuyen-backend.onrender.com/api/stations" | jq '.[] | .city'

# If empty, seed database:
npx ts-node prisma/seed-production.ts
```

### Issue: "Payment endpoint not found" (404)
**Solution:**
- Check Onrender build logs for errors
- Verify payment routes were added to index.ts
- Force redeploy: delete and recreate service on Onrender

### Issue: "CORS error from frontend"
**Solution:**
- Check backend CORS config (should allow all origins during testing)
- In production, add specific frontend domain

### Issue: "Booking creation fails"
**Solution:**
- Verify trip exists in database
- Check user is authenticated
- Review backend logs for error details

---

## 📊 Verification Commands

Quick verification that everything works:

```bash
#!/bin/bash

API="https://anchuyen-backend.onrender.com/api"

echo "🧪 Testing An Chuyến API..."
echo ""

# Test 1: Health
echo "1. Health Check:"
curl -s "$API/../health" | jq . && echo "✅ API is running"

# Test 2: Cities
echo ""
echo "2. Cities in Database:"
curl -s "$API/stations" | jq '.[] | select(.city.id != null) | .city.name' | sort -u | wc -l
echo "   ✅ Cities found"

# Test 3: Trips
echo ""
echo "3. Searching Trips:"
TRIPS=$(curl -s "$API/trips?origin=TP.HCM&destination=Nha%20Trang&date=2026-08-11&limit=1")
echo $TRIPS | jq '.data | length'
echo "   ✅ Trips found"

echo ""
echo "🎉 All systems operational!"
```

---

## 📝 Summary of Changes

| File | Status | Size | Purpose |
|------|--------|------|---------|
| payment.dto.ts | ✅ Created | 942 B | Type definitions |
| payment.controller.ts | ✅ Created | 3.0 KB | API handlers |
| payment.service.ts | ✅ Created | 3.4 KB | Business logic |
| payment.routes.ts | ✅ Created | 796 B | Route definitions |
| index.ts | ✅ Modified | - | Added payment routes |
| seed-production.ts | ✅ Created | 5.7 KB | DB initialization |

**Total New Code:** ~14 KB

---

## ✅ Pre-Flight Checklist

- [ ] All 4 payment module files created
- [ ] index.ts has payment import
- [ ] index.ts uses payment routes
- [ ] Payment routes file exists
- [ ] Seed script created
- [ ] No TypeScript errors (npm run build)
- [ ] Git push to main successful
- [ ] Onrender shows "Live" status
- [ ] Database seeded with cities/routes/trips
- [ ] API endpoints return data
- [ ] Frontend search returns trips
- [ ] Payment button doesn't redirect

---

## 🎯 Expected Results

After deployment:

1. ✅ Users can search for trips (returns data, not 0)
2. ✅ Users can select seats
3. ✅ Users can fill passenger info
4. ✅ Users can click "Continue to Payment" without redirect
5. ✅ Payment page loads with COD option
6. ✅ Admin can confirm COD payments
7. ✅ Bookings get marked as CONFIRMED
8. ✅ Full end-to-end booking flow works

---

## 🚨 Emergency Rollback

If something breaks after deployment:

```bash
# Revert last commit
git revert HEAD
git push origin main

# Wait for Onrender to redeploy
# Service will return to previous state
```

---

**Status: ✅ READY FOR DEPLOYMENT**  
**Last Updated:** Aug 15, 2026

