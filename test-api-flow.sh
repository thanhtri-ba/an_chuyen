#!/bin/bash

API_URL="https://anchuyen-backend.onrender.com/api"
FRONTEND_URL="https://anchuyen-12.pages.dev"

echo "🧪 An Chuyến API Testing Flow"
echo "=================================="
echo ""

# Test 1: Health Check
echo "1️⃣ Testing API Health..."
curl -s "${API_URL%/api}/health" | jq . || echo "❌ Health check failed"
echo ""

# Test 2: Get Trips
echo "2️⃣ Searching for trips (TP.HCM → Nha Trang)..."
TRIPS=$(curl -s "${API_URL}/trips?origin=TP.HCM&destination=Nha%20Trang&date=2026-08-11&page=1&limit=20" | jq .)
echo "$TRIPS" | jq '.' || echo "❌ Trip search failed"
echo ""

# Extract first trip ID if available
TRIP_ID=$(echo "$TRIPS" | jq -r '.data[0].id // empty' 2>/dev/null)
if [ -n "$TRIP_ID" ]; then
  echo "✅ Found trip: $TRIP_ID"
else
  echo "⚠️  No trips found - Database may need seeding"
fi

echo ""
echo "📊 API Test Summary:"
echo "  - Health: $(curl -s -o /dev/null -w '%{http_code}' ${API_URL%/api}/health)"
echo "  - Trips: $(echo $TRIPS | jq '.data | length')"
echo ""
echo "🔗 Frontend: $FRONTEND_URL"
echo "🔗 Backend: $API_URL"
echo ""
