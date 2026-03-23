import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://localhost:3000/api';
const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('staff_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(r => r, error => {
  if (error.response?.status === 401) AsyncStorage.removeItem('staff_token');
  return Promise.reject(error);
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
};

export const tripAPI = {
  getAssigned: () => api.get('/trips/assigned'),
  getById: (id) => api.get(`/trips/${id}`),
  start: (id) => api.post(`/trips/${id}/start`),
  end: (id) => api.post(`/trips/${id}/end`),
  getManifest: (id) => api.get(`/trips/${id}/manifest`),
  updatePassengerStatus: (tripId, bookingId, data) => api.patch(`/trips/${tripId}/bookings/${bookingId}`, data),
};

export const ticketAPI = {
  validate: (data) => api.post('/kiosk/validate-ticket', data),
  boardPassenger: (data) => api.post('/trips/board', data),
};

export const incidentAPI = {
  create: (data) => api.post('/tracking/incidents', data),
  getByTrip: (tripId) => api.get(`/tracking/incidents?trip_id=${tripId}`),
};

export const shiftAPI = {
  clockIn: (data) => api.post('/employees/shift/clock-in', data),
  clockOut: (data) => api.post('/employees/shift/clock-out', data),
  getCurrent: () => api.get('/employees/shift/current'),
  getHistory: () => api.get('/employees/shift/history'),
};

export const geoTagAPI = {
  checkIn: (data) => api.post('/tracking/geo-tag', data),
  getCheckpoints: (tripId) => api.get(`/tracking/checkpoints/${tripId}`),
};

export const trackingAPI = {
  updateLocation: (data) => api.post('/tracking/update', data),
  sendSOS: (data) => api.post('/tracking/sos', data),
};

export default api;
