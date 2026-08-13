import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api', // Use environment variable in production
  headers: {
    'Content-Type': 'application/json',
  },
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
 if (error.response?.status === 401) {
 sessionStorage.removeItem('busz_token');
 const currentPath = window.location.pathname + window.location.search;
 if (currentPath !== '/auth') {
 window.location.href = `/auth?returnUrl=${encodeURIComponent(currentPath)}`;
 }
 }
 return Promise.reject(error);
});

export default api;
