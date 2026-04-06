import axios from 'axios';
import { useAuthSessionStore } from '../modules/auth/store/useAuthSession';

const isAuthRequest = (url?: string): boolean => {
  if (!url) return false;
  return url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/confirmar-reset');
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación a cada solicitud
api.interceptors.request.use((config) => {
  const { token } = useAuthSessionStore.getState();

  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url ?? '';
    const authRequest = isAuthRequest(requestUrl);
    const status = error.response?.status;

    if ((status === 401 || status === 403) && !authRequest) {
      const { logout } = useAuthSessionStore.getState();
      logout();
      window.dispatchEvent(new Event('app:auth-expired'));
    }

    return Promise.reject(error);
  }
);
