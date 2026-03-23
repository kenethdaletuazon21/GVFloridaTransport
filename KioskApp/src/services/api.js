import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Kiosk token for authenticated requests
let kioskToken = null;

api.interceptors.request.use((config) => {
  if (kioskToken) {
    config.headers.Authorization = `Bearer ${kioskToken}`;
  }
  config.headers['X-Kiosk-ID'] = 'KIOSK-SAMPALOC-001';
  return config;
});

export const setKioskToken = (token) => { kioskToken = token; };
export const clearKioskToken = () => { kioskToken = null; };

// Route & Trip APIs
export const routeAPI = {
  getAll: () => api.get('/routes'),
  getDestinations: () => api.get('/routes/destinations'),
};

export const tripAPI = {
  search: (params) => api.get('/trips/search', { params }),
  getById: (id) => api.get(`/trips/${id}`),
  getSeats: (tripId) => api.get(`/trips/${tripId}/seats`),
};

// Booking APIs
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getByCode: (code) => api.get(`/bookings/code/${code}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
};

// Payment APIs
export const paymentAPI = {
  process: (data) => api.post('/payments/process', data),
  verifyWallet: (phone) => api.get(`/payments/wallet/verify/${phone}`),
};

// Auth APIs (for passenger login at kiosk)
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  guestCheckout: () => api.post('/auth/guest'),
};

// Wallet APIs
export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  topUp: (data) => api.post('/wallet/top-up', data),
  getTransactions: () => api.get('/wallet/transactions'),
};

export default api;
