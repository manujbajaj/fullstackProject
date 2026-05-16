import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1/users',
  withCredentials: true, // sends cookies automatically (accessToken / refreshToken)
});

// Attach Bearer token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
