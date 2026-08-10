import axios from'axios';

const api = axios.create({
 baseURL:'http://127.0.0.1:3000/api', // Point to backend Express API
 headers: {
'Content-Type':'application/json',
 },
});

api.interceptors.request.use((config) => {
 const token = localStorage.getItem('busz_token');
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
 localStorage.removeItem('busz_token');
 }
 return Promise.reject(error);
});

export default api;
