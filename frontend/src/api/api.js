import axios from 'axios';
import { refreshAccessToken } from '../services/authService.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor de request: agregar token a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de response: manejar tokens expirados y renovarlos automáticamente
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Manejar errores 429 (Rate Limit) - NO recargar página
    if (error.response?.status === 429) {
      // Retornar el error sin recargar, para que el componente lo maneje
      return Promise.reject(error);
    }

    // Si el error es 401 y no es una petición de refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya se está refrescando, encolar esta petición
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const result = await refreshAccessToken();
        
        if (result.ok && result.accessToken) {
          // Procesar cola de peticiones pendientes
          processQueue(null, result.accessToken);
          
          // Reintentar petición original
          originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
          return api(originalRequest);
        } else {
          // Si no se pudo refrescar, redirigir al login
          processQueue(new Error('Token refresh failed'), null);
          localStorage.clear();
          window.location.href = '/ingresar';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/ingresar';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
