import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

// --- EXPLICACIÓN ---
// Este store es simple y síncrono. Su única responsabilidad es manejar el estado.
// No realiza llamadas a la API, lo que evita complejidades y race conditions.
// Es la versión que tenías y que funciona perfectamente para este flujo.

export const useAuthStore = create((set, get) => ({
  token: localStorage.getItem('token') || null,
  user: localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null,
  isAuthenticated: !!localStorage.getItem('token'),

  login: (token) => {
    const decodedUser = jwtDecode(token);
    localStorage.setItem('token', token);
    set({ token, user: decodedUser, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false });
    // Forzar recarga es una buena manera de asegurar que todo el estado se limpia.
    window.location.href = '/login';
  },
  
  // Función de ayuda para verificar roles, muy útil para el enrutador.
  hasAnyRole: (roles) => {
    const { user } = get();
    return user && roles.includes(user.role);
  }
}));