import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gvf_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gvf_admin_token');
      localStorage.removeItem('gvf_admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/staff/login', credentials),
};

export const dashboardAPI = {
  getSummary: () => api.get('/reports/dashboard'),
  getRevenue: (params) => api.get('/reports/revenue', { params }),
  getTripPerformance: (params) => api.get('/reports/trips', { params }),
};

export const fleetAPI = {
  getAll: (params) => api.get('/fleet', { params }),
  getById: (id) => api.get(`/fleet/${id}`),
  create: (data) => api.post('/fleet', data),
  update: (id, data) => api.put(`/fleet/${id}`, data),
  delete: (id) => api.delete(`/fleet/${id}`),
  getMaintenance: (id) => api.get(`/fleet/${id}/maintenance`),
  addMaintenance: (id, data) => api.post(`/fleet/${id}/maintenance`, data),
};

export const employeeAPI = {
  getAll: (params) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  getShifts: (id) => api.get(`/employees/${id}/shifts`),
};

export const tripAPI = {
  getAll: (params) => api.get('/trips', { params }),
  getById: (id) => api.get(`/trips/${id}`),
  create: (data) => api.post('/trips', data),
  getManifest: (id) => api.get(`/trips/${id}/manifest`),
  start: (id) => api.put(`/trips/${id}/start`),
  end: (id, data) => api.put(`/trips/${id}/end`, data),
};

export const bookingAPI = {
  search: (params) => api.get('/bookings/search', { params }),
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
};

export const routeAPI = {
  getAll: () => api.get('/routes'),
  getById: (id) => api.get(`/routes/${id}`),
  create: (data) => api.post('/routes', data),
  update: (id, data) => api.put(`/routes/${id}`, data),
};

export const payrollAPI = {
  getAll: (params) => api.get('/payroll', { params }),
  generate: (data) => api.post('/payroll/generate', data),
  approve: (id) => api.put(`/payroll/${id}/approve`),
  pay: (id) => api.put(`/payroll/${id}/pay`),
};

export const reportAPI = {
  getDashboard: () => api.get('/reports/dashboard'),
  getRevenue: (params) => api.get('/reports/revenue', { params }),
  getTrips: (params) => api.get('/reports/trips', { params }),
  getEmployees: (params) => api.get('/reports/employees', { params }),
};

export const trackingAPI = {
  getActiveBuses: () => api.get('/tracking/active'),
  getTripLocation: (tripId) => api.get(`/tracking/trip/${tripId}`),
};

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  send: (data) => api.post('/notifications', data),
};

export default api;
