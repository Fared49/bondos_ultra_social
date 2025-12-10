import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const roomsAPI = {
  list: () => api.get('/rooms'),
  get: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  join: (id) => api.post(`/rooms/${id}/join`),
  joinByInvite: (code) => api.post(`/rooms/${code}/invite`),
  getMessages: (id) => api.get(`/rooms/${id}/messages`),
  startGame: (id, data) => api.post(`/rooms/${id}/game/start`, data),
};

export const postsAPI = {
  list: () => api.get('/posts'),
  create: (data) => api.post('/posts', data),
  like: (id) => api.post(`/posts/${id}/like`),
  comment: (id, data) => api.post(`/posts/${id}/comment`, data),
};

export const usersAPI = {
  search: (q) => api.get('/auth/search', { params: { q } }),
  follow: (id) => api.post(`/auth/follow/${id}`),
};
