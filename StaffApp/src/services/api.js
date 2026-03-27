import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('staff_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(r => r, error => {
  if (error.response?.status === 401) localStorage.removeItem('staff_token');
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
};

export const ticketAPI = {
  validate: (data) => api.post('/kiosk/validate-ticket', data),
};

export const incidentAPI = {
  create: (data) => api.post('/tracking/incidents', data),
};

export const shiftAPI = {
  clockIn: (data) => api.post('/employees/shift/clock-in', data),
  clockOut: (data) => api.post('/employees/shift/clock-out', data),
  getHistory: () => api.get('/employees/shift/history'),
};

export const geoTagAPI = {
  checkIn: (data) => api.post('/tracking/geo-tag', data),
  getCheckpoints: (tripId) => api.get(`/tracking/checkpoints/${tripId}`),
};

export default api;
