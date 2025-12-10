import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => axiosInstance.post('/auth/login', data),
  register: (data) => axiosInstance.post('/auth/register', data),
  refresh: () => axiosInstance.post('/auth/refresh'),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
  followUser: (userId) => axiosInstance.post(`/auth/follow/${userId}`),
  searchUsers: (query) => axiosInstance.get(`/auth/search?q=${query}`),
};

// Rooms API
export const roomsAPI = {
  create: (data) => axiosInstance.post('/rooms/create', data),
  list: () => axiosInstance.get('/rooms'),
  get: (roomId) => axiosInstance.get(`/rooms/${roomId}`),
  join: (roomId) => axiosInstance.post(`/rooms/${roomId}/join`),
  leave: (roomId) => axiosInstance.post(`/rooms/${roomId}/leave`),
  joinByInvite: (inviteCode) => axiosInstance.post(`/rooms/invite/${inviteCode}`),
  getMessages: (roomId) => axiosInstance.get(`/rooms/${roomId}/messages`),
  startGame: (roomId, data) => axiosInstance.post(`/rooms/${roomId}/game/start`, data),
};

// Posts API
export const postsAPI = {
  create: (data) => axiosInstance.post('/posts/create', data),
  list: () => axiosInstance.get('/posts'),
  get: (postId) => axiosInstance.get(`/posts/${postId}`),
  trending: () => axiosInstance.get('/posts/trending'),
  like: (postId) => axiosInstance.post(`/posts/${postId}/like`),
  comment: (postId, data) => axiosInstance.post(`/posts/${postId}/comment`, data),
};

// Users API
export const usersAPI = {
  getProfile: (userId) => axiosInstance.get(`/users/${userId}`),
  getPosts: (userId) => axiosInstance.get(`/users/${userId}/posts`),
  getFollowers: (userId) => axiosInstance.get(`/users/${userId}/followers`),
  getFollowing: (userId) => axiosInstance.get(`/users/${userId}/following`),
};

export default axiosInstance;
