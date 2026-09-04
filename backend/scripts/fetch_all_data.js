/**
 * Script lấy dữ liệu từ API backend An Chuyến.
 * Dùng để export dữ liệu chuyến, ghế, booking, payment của TÀI KHOẢN CỦA BẠN.
 *
 * Cách dùng:
 *   BASE_URL=http://127.0.0.1:3000/api EMAIL=you@mail.com PASSWORD=yourpass node scripts/fetch_all_data.js
 *
 * Nếu chỉ muốn lấy dữ liệu công khai (thông tin chuyến + sơ đồ ghế), truyền TRIP_SCHEDULE_ID:
 *   TRIP_SCHEDULE_ID=2a9b99d3-7b1e-4d0a-93ed-ea070d6d8a19 node scripts/fetch_all_data.js
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000/api';
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const TRIP_SCHEDULE_ID = process.env.TRIP_SCHEDULE_ID;

const OUT_DIR = path.join(__dirname, 'output');

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    console.warn(`⚠️  ${options.method || 'GET'} ${url} -> ${res.status}`);
  }
  return json;
}

async function login(email, password) {
  const data = await fetchJson(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const token = data?.data?.accessToken || data?.accessToken;
  if (!token) throw new Error('Đăng nhập thất bại: ' + JSON.stringify(data));
  return token;
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function save(name, data) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, `${name}.json`), JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✔ Saved ${name}.json`);
}

async function main() {
  const result = {};

  // 1. Dữ liệu công khai: chi tiết chuyến + sơ đồ ghế
  if (TRIP_SCHEDULE_ID) {
    result.tripDetail = await fetchJson(`${BASE_URL}/trip-schedules/${TRIP_SCHEDULE_ID}`);
    result.seatMap = await fetchJson(`${BASE_URL}/trip-schedules/${TRIP_SCHEDULE_ID}/seats`);
    save('trip_detail', result.tripDetail);
    save('seat_map', result.seatMap);
  } else {
    console.log('ℹ️  Bỏ qua trip detail/seat map vì thiếu TRIP_SCHEDULE_ID');
  }

  // 2. Dữ liệu riêng tư: cần đăng nhập
  if (EMAIL && PASSWORD) {
    console.log('🔐 Đang đăng nhập...');
    const token = await login(EMAIL, PASSWORD);

    const profile = await fetchJson(`${BASE_URL}/auth/profile`, { headers: authHeaders(token) });
    save('profile', profile);

    const bookings = await fetchJson(`${BASE_URL}/bookings`, { headers: authHeaders(token) });
    save('bookings', bookings);

    const loyalty = await fetchJson(`${BASE_URL}/loyalty/me`, { headers: authHeaders(token) });
    save('loyalty', loyalty);

    // Lấy payment cho từng booking
    const bookingList = bookings?.data || [];
    const payments = [];
    for (const b of bookingList) {
      const p = await fetchJson(`${BASE_URL}/payments/booking/${b.id}`, { headers: authHeaders(token) });
      payments.push(p);
    }
    save('payments', payments);
  } else {
    console.log('ℹ️  Bỏ qua booking/payment/profile vì thiếu EMAIL/PASSWORD');
  }

  console.log('\n✅ Hoàn tất. Kết quả nằm trong scripts/output/');
}

main().catch((err) => {
  console.error('❌ Lỗi:', err.message);
  process.exit(1);
});
