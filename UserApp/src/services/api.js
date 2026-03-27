import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gvf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('gvf_token');
      localStorage.removeItem('gvf_user');
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const bookingAPI = {
  search: (params) => api.get('/bookings/search', { params }),
  getSeats: (tripId) => api.get(`/bookings/${tripId}/seats`),
  create: (data) => api.post('/bookings', data),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
};

export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  topUp: (data) => api.post('/wallet/topup', data),
  getTransactions: () => api.get('/wallet/transactions'),
};

export const routeAPI = {
  getAll: () => api.get('/routes'),
};

export default api;
