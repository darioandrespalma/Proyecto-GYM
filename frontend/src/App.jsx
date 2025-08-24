import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import MemberLayout from './components/layout/MemberLayout';
import ProtectedRoute from './router/ProtectedRoute';

// Páginas Públicas
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Páginas de Administrador
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import MembersListPage from './pages/admin/MembersListPage';
import PaymentsListPage from './pages/admin/PaymentsListPage';
import ClassesManagePage from './pages/admin/ClassesManagePage';
import TrainersManagePage from './pages/admin/TrainersManagePage';

// Páginas de Miembro
import MemberDashboardPage from './pages/member/MemberDashboardPage';
import SchedulePage from './pages/member/SchedulePage';
import RenewMembershipPage from './pages/member/RenewMembershipPage';
import ProfilePage from './pages/member/ProfilePage';

// Páginas de Entrenador
import TrainerDashboardPage from './pages/trainer/TrainerDashboardPage';
import ClassAttendancePage from './pages/trainer/ClassAttendancePage';

function App() {
  return (
    <Routes>
      {/* Redirección inicial a Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Rutas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas Protegidas para Administrador */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="members" element={<MembersListPage />} />
          <Route path="payments" element={<PaymentsListPage />} />
          <Route path="classes" element={<ClassesManagePage />} />
          <Route path="trainers" element={<TrainersManagePage />} />
        </Route>
      </Route>

      {/* Rutas Protegidas para Miembros */}
      <Route element={<ProtectedRoute role="member" />}>
        <Route path="/member" element={<MemberLayout />}>
           <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<MemberDashboardPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="renew" element={<RenewMembershipPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Rutas Protegidas para Entrenadores */}
      <Route element={<ProtectedRoute role="trainer" />}>
        <Route path="/trainer" element={<AdminLayout />}>{/* Puedes crear un TrainerLayout si quieres */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TrainerDashboardPage />} />
          <Route path="attendance" element={<ClassAttendancePage />} />
        </Route>
      </Route>

      {/* Ruta para páginas no encontradas */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;