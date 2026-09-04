/**
 * Dán đoạn này vào Console của trình duyệt (F12 > Console) khi đang mở trang
 * seat-selection của An Chuyến. Nó sẽ tự dò tripScheduleId từ URL, gọi API
 * backend để lấy chi tiết chuyến + sơ đồ ghế, rồi tải về 1 file JSON.
 */
(async () => {
  const API_BASE = 'https://anchuyen-backend.onrender.com/api';
  const match = window.location.pathname.match(/seat-selection\/([a-f0-9-]+)/i);
  if (!match) {
    console.error('Không tìm thấy tripScheduleId trong URL.');
    return;
  }
  const tripScheduleId = match[1];

  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  async function getJson(url) {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn(`⚠️ ${url} -> ${res.status}`);
      return null;
    }
    return res.json();
  }

  const [tripDetail, seatMap] = await Promise.all([
    getJson(`${API_BASE}/trip-schedules/${tripScheduleId}`),
    getJson(`${API_BASE}/trip-schedules/${tripScheduleId}/seats`)
  ]);

  const result = { tripScheduleId, tripDetail, seatMap, scrapedAt: new Date().toISOString() };
  console.log(result);

  const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `trip_${tripScheduleId}.json`;
  a.click();
})();
