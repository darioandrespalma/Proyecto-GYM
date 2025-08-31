// Frontend/src/api/apiClient.js
// --- ASEGÚRATE DE QUE TU ARCHIVO ESTÉ ASÍ ---

import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
});

// Interceptor: se ejecuta ANTES de cada petición
apiClient.interceptors.request.use(
  (config) => {
    // Pide el token al "carnet de identidad" (nuestro store)
    const token = useAuthStore.getState().token;
    if (token) {
      // Si hay token, lo pone en la cabecera, como un sello en un pasaporte
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta (opcional pero muy recomendado)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si el backend nos dice "No autorizado", significa que el token es inválido o expiró.
      // Limpiamos la sesión y redirigimos al login.
      console.log("Token inválido o expirado. Cerrando sesión.");
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;