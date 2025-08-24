import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null,

  login: (token) => {
    const decodedUser = jwtDecode(token);
    localStorage.setItem('token', token);
    set({ token, user: decodedUser });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
    // Forzar recarga para limpiar cualquier estado restante y redirigir
    window.location.href = '/login';
  },
}));