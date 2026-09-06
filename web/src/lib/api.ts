import axios from 'axios';

export const api = axios.create({
  // 'localhost' chứ không phải '127.0.0.1' — phải cùng site với frontend
  // (localhost:5173) để cookie phiên thiết bị (SameSite=Lax) được trình
  // duyệt gửi kèm; 127.0.0.1 bị coi là site khác nên cookie luôn bị chặn.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Bắt buộc để cookie phiên thiết bị (Email+OTP, identity.controller.ts) đi
  // kèm request — backend đã bật cors({ credentials: true }) tương ứng.
  withCredentials: true,
});

api.interceptors.request.use((config) => {
 const token = sessionStorage.getItem('busz_token');
 if (token && config.headers) {
 config.headers.Authorization = `Bearer ${token}`;
 }
 return config;
}, (error) => {
 return Promise.reject(error);
});

api.interceptors.response.use((response) => {
 return response;
}, (error) => {
 // GET /identity/session trả 401 hợp lệ cho MỌI khách chưa từng xác minh
 // Email+OTP (kể cả khách mới vào web lần đầu) — đây không phải "phiên JWT
 // cũ đã chết", nên không được kích hoạt redirect /auth cho nhóm endpoint
 // Email+OTP (identity.service.ts) như dưới đây.
 const isIdentityRequest = (error.config?.url as string | undefined)?.includes('/identity/');
 if (error.response?.status === 401 && !isIdentityRequest) {
 sessionStorage.removeItem('busz_token');
 const currentPath = window.location.pathname + window.location.search;
 if (currentPath !== '/auth') {
 window.location.href = `/auth?returnUrl=${encodeURIComponent(currentPath)}`;
 }
 }
 return Promise.reject(error);
});

export default api;
