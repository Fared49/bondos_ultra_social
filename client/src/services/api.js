<<<<<<< HEAD
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
=======
import apiClient from './apiClient';

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  refreshToken: (refreshToken) => apiClient.post('/auth/refresh', { refreshToken }),
};

export const usersAPI = {
  getProfile: (userId) => apiClient.get(`/users/${userId}`),
  updateProfile: (userId, data) => apiClient.put(`/users/${userId}`, data),
  followUser: (userId) => apiClient.post(`/users/${userId}/follow`),
  unfollowUser: (userId) => apiClient.post(`/users/${userId}/unfollow`),
  searchUsers: (query) => apiClient.get('/users/search', { params: { query } }),
};

export const postsAPI = {
  getAllPosts: (params) => apiClient.get('/posts', { params }),
  createPost: (data) => apiClient.post('/posts', data),
  getPost: (postId) => apiClient.get(`/posts/${postId}`),
  updatePost: (postId, data) => apiClient.put(`/posts/${postId}`, data),
  deletePost: (postId) => apiClient.delete(`/posts/${postId}`),
  likePost: (postId) => apiClient.post(`/posts/${postId}/like`),
  unlikePost: (postId) => apiClient.post(`/posts/${postId}/unlike`),
  addComment: (postId, data) => apiClient.post(`/posts/${postId}/comments`, data),
  getUserPosts: (userId, params) => apiClient.get(`/posts/user/${userId}`, { params }),
};

export const themesAPI = {
  getAllThemes: () => apiClient.get('/themes'),
  getUserTheme: (userId) => apiClient.get(`/themes/user/${userId}`),
  setUserTheme: (userId, data) => apiClient.put(`/themes/user/${userId}`, data),
};
>>>>>>> 53a9161 (🚀 Initial project setup: Full-stack app with React, Node.js, Express, MongoDB, JWT Auth, Docker)
