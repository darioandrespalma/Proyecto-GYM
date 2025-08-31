import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

// Layouts
import AdminLayout from '../components/layout/AdminLayout';
import MemberLayout from '../components/layout/MemberLayout';
import TrainerLayout from '../components/layout/TrainerLayout';

// Public Pages
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import NotFoundPage from '../pages/public/NotFoundPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import MembersListPage from '../pages/admin/MembersListPage';
import TrainersManagePage from '../pages/admin/TrainersManagePage';
import ClassesManagePage from '../pages/admin/ClassesManagePage';
import PaymentsListPage from '../pages/admin/PaymentsListPage';

// Member Pages
import MemberDashboardPage from '../pages/member/MemberDashboardPage';
import RenewMembershipPage from '../pages/member/RenewMembershipPage';
import ProfilePage from '../pages/member/ProfilePage';
import ClassesPage from '../pages/member/ClassesPage'; // Nueva página de clases

// Trainer Pages
import TrainerDashboardPage from '../pages/trainer/TrainerDashboardPage'; // Nueva página
import ClassAttendancePage from '../pages/trainer/ClassAttendancePage'; // Nueva página

// Componente de ruta protegida
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<div>No tienes permisos para acceder a esta página</div>} />
      
      {/* Rutas de administrador */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="members" element={<MembersListPage />} />
        <Route path="trainers" element={<TrainersManagePage />} />
        <Route path="classes" element={<ClassesManagePage />} />
        <Route path="payments" element={<PaymentsListPage />} />
      </Route>
      
      {/* Rutas de miembro */}
      <Route 
        path="/member/*" 
        element={
          <ProtectedRoute allowedRoles={['member']}>
            <MemberLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MemberDashboardPage />} />
        <Route path="renew-membership" element={<RenewMembershipPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="classes" element={<ClassesPage />} /> {/* Nueva ruta */}
      </Route>
      
      {/* Rutas de entrenador */}
      <Route 
        path="/trainer/*" 
        element={
          <ProtectedRoute allowedRoles={['trainer']}>
            <TrainerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TrainerDashboardPage />} /> {/* Nueva ruta */}
        <Route path="classes" element={<TrainerClassesPage />} /> {/* Nueva ruta */}
        <Route path="attendance" element={<ClassAttendancePage />} /> {/* Nueva ruta */}
      </Route>
      
      {/* Rutas por defecto y 404 */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;