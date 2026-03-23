import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://localhost:5000/api'; // Change for production

const api = axios.create({ baseURL: API_BASE, timeout: 30000 });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('gvf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await AsyncStorage.multiRemove(['gvf_token', 'gvf_user']);
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
  getTrips: () => api.get('/users/trips'),
  getLoyalty: () => api.get('/users/loyalty'),
};

export const bookingAPI = {
  search: (params) => api.get('/bookings/search', { params }),
  getSeats: (tripId) => api.get(`/bookings/${tripId}/seats`),
  create: (data) => api.post('/bookings', data),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
};

export const paymentAPI = {
  process: (data) => api.post('/payments', data),
  getHistory: () => api.get('/payments/history'),
  getReceipt: (id) => api.get(`/payments/${id}/receipt`),
};

export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  topUp: (data) => api.post('/wallet/topup', data),
  pay: (data) => api.post('/wallet/pay', data),
  getTransactions: () => api.get('/wallet/transactions'),
};

export const trackingAPI = {
  getTripLocation: (tripId) => api.get(`/tracking/trip/${tripId}`),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

export const routeAPI = {
  getAll: () => api.get('/routes'),
};

export default api;
