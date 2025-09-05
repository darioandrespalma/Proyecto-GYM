import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role;

  // Enlaces para el rol de Administrador
  const adminLinks = [
    { to: "/admin/dashboard", icon: <ChartBarIcon className="h-5 w-5 mr-3" />, text: "Dashboard" },
    { to: "/admin/members", icon: <UsersIcon className="h-5 w-5 mr-3" />, text: "Miembros" },
    { to: "/admin/payments", icon: <CurrencyDollarIcon className="h-5 w-5 mr-3" />, text: "Pagos" },
    { to: "/admin/classes", icon: <ClipboardDocumentListIcon className="h-5 w-5 mr-3" />, text: "Clases" },
    { to: "/admin/trainers", icon: <UserGroupIcon className="h-5 w-5 mr-3" />, text: "Entrenadores" },
  ];

  // Enlaces para el rol de Entrenador
  const trainerLinks = [
    { to: "/trainer/dashboard", icon: <ChartBarIcon className="h-5 w-5 mr-3" />, text: "Dashboard" },
    { to: "/trainer/classes", icon: <ClipboardDocumentListIcon className="h-5 w-5 mr-3" />, text: "Mis Clases" },
  ];

  // Enlaces para el rol de Miembro
  const memberLinks = [
    { to: "/member/dashboard", icon: <ChartBarIcon className="h-5 w-5 mr-3" />, text: "Mi Panel" },
    { to: "/member/schedule", icon: <CalendarDaysIcon className="h-5 w-5 mr-3" />, text: "Horario" },
    { to: "/member/classes", icon: <ClipboardDocumentListIcon className="h-5 w-5 mr-3" />, text: "Mis Clases" },
    { to: "/member/renew-membership", icon: <CurrencyDollarIcon className="h-5 w-5 mr-3" />, text: "Membresía" },
    { to: "/member/profile", icon: <UserCircleIcon className="h-5 w-5 mr-3" />, text: "Mi Perfil" },
  ];

  let linksToShow = [];
  if (userRole === 'admin') {
    linksToShow = adminLinks;
  } else if (userRole === 'trainer') {
    linksToShow = trainerLinks;
  } else if (userRole === 'member') {
    linksToShow = memberLinks;
  }

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col h-full">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">
          {userRole === 'admin' && 'Panel de Administración'}
          {userRole === 'trainer' && 'Panel de Entrenador'}
          {userRole === 'member' && 'Mi Cuenta'}
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {linksToShow.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            {link.icon}
            <span className="ml-2">{link.text}</span>
          </NavLink>
        ))}
      </nav>

      {/* Perfil de usuario en la parte inferior */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <UserCircleIcon className="h-10 w-10 text-gray-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.fullName || 'Usuario'}
            </p>
            <p className="text-xs text-gray-400 truncate capitalize">
              {userRole}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;