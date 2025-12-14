import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include accessToken from `tokens` object
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const tokensRaw = localStorage.getItem('tokens');
      if (tokensRaw) {
        const { accessToken } = JSON.parse(tokensRaw);
        if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (e) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors and try refresh on 401/403
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if ((status === 401 || status === 403) && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const tokens = JSON.parse(localStorage.getItem('tokens') || 'null');
        if (!tokens?.refreshToken) throw new Error('No refresh token');
        const resp = await axios.post(`${API_URL}/auth/refresh`, { refreshToken: tokens.refreshToken });
        const newAccessToken = resp.data.accessToken;
        const newTokens = { ...tokens, accessToken: newAccessToken };
        localStorage.setItem('tokens', JSON.stringify(newTokens));
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
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
