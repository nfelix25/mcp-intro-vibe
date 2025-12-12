import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authApi = {
  signUp: (data) => api.post('/auth/sign-up/email', data),
  signIn: (data) => api.post('/auth/sign-in/email', data),
  signOut: () => api.post('/auth/sign-out'),
  getSession: () => api.get('/auth/get-session'),
};

// Issues API
export const issuesApi = {
  list: (params) => api.get('/issues', { params }),
  create: (data) => api.post('/issues', data),
  get: (id) => api.get(`/issues/${id}`),
  update: (id, data) => api.put(`/issues/${id}`, data),
  delete: (id) => api.delete(`/issues/${id}`),
};

// Tags API
export const tagsApi = {
  list: () => api.get('/tags'),
  create: (data) => api.post('/tags', data),
  delete: (id) => api.delete(`/tags/${id}`),
};

// Users API
export const usersApi = {
  list: () => api.get('/users'),
};

export default api;
