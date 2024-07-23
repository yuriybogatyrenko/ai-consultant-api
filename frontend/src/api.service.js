import axios from 'axios';
import authService from '@/services/auth/auth.service';
import router from './router';

const api = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}${
    process.env.NODE_ENV !== 'production' ? ':3000' : ''
  }/api`,
});

api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      authService.removeToken();
      router.push('/auth/login');
    }
    return Promise.reject(error);
  },
);

export default api;
