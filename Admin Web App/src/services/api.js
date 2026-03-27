import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(r => r, error => {
  if (error.response?.status === 401) localStorage.removeItem('admin_token');
  return Promise.reject(error);
});

export const dashboardAPI = {
  getStats: () => api.get('/admin/dashboard'),
};

export const routeAPI = {
  getAll: () => api.get('/admin/routes'),
  create: (data) => api.post('/admin/routes', data),
  update: (id, data) => api.put(`/admin/routes/${id}`, data),
  delete: (id) => api.delete(`/admin/routes/${id}`),
};

export const tripAPI = {
  getAll: () => api.get('/admin/trips'),
  create: (data) => api.post('/admin/trips', data),
  update: (id, data) => api.put(`/admin/trips/${id}`, data),
};

export const bookingAPI = {
  getAll: () => api.get('/admin/bookings'),
  getById: (id) => api.get(`/admin/bookings/${id}`),
};

export const userAPI = {
  getAll: () => api.get('/admin/users'),
  create: (data) => api.post('/admin/users', data),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
};

export const staffAPI = {
  getAll: () => api.get('/admin/staff'),
  create: (data) => api.post('/admin/staff', data),
  update: (id, data) => api.put(`/admin/staff/${id}`, data),
};

export const fleetAPI = {
  getAll: () => api.get('/admin/fleet'),
  create: (data) => api.post('/admin/fleet', data),
  update: (id, data) => api.put(`/admin/fleet/${id}`, data),
};

export const incidentAPI = {
  getAll: () => api.get('/admin/incidents'),
};

export default api;
