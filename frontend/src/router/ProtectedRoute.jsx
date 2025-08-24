import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute = ({ role }) => {
  const { token, user } = useAuthStore((state) => state);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Si el rol es requerido y el rol del usuario no coincide, redirigir
  if (role && user?.role !== role) {
    // Podrías redirigir a una página de "Acceso Denegado" o de vuelta al login
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;