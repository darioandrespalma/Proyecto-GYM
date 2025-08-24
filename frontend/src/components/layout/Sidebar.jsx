import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/solid';

const linkClasses = "flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors";
const activeLinkClasses = "bg-blue-600 text-white";

// Enlaces para el rol de Administrador
const adminLinks = [
    { to: "/admin/dashboard", icon: <ChartBarIcon className="h-6 w-6 mr-3" />, text: "Dashboard" },
    { to: "/admin/members", icon: <UsersIcon className="h-6 w-6 mr-3" />, text: "Miembros" },
    { to: "/admin/payments", icon: <CurrencyDollarIcon className="h-6 w-6 mr-3" />, text: "Pagos" },
    { to: "/admin/classes", icon: <ClipboardDocumentListIcon className="h-6 w-6 mr-3" />, text: "Clases" },
    { to: "/admin/trainers", icon: <UserGroupIcon className="h-6 w-6 mr-3" />, text: "Entrenadores" },
];

// Enlaces para el rol de Entrenador
const trainerLinks = [
    { to: "/trainer/dashboard", icon: <ChartBarIcon className="h-6 w-6 mr-3" />, text: "Dashboard" },
    { to: "/trainer/attendance", icon: <CalendarDaysIcon className="h-6 w-6 mr-3" />, text: "Asistencia" },
];

const Sidebar = () => {
  const userRole = useAuthStore((state) => state.user?.role);

  let linksToShow = [];
  if (userRole === 'admin') {
    linksToShow = adminLinks;
  } else if (userRole === 'trainer') {
    linksToShow = trainerLinks;
  }
  // Podrías añadir un 'else if' para el rol 'member' si tuviera un layout con sidebar

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <div className="text-2xl font-bold mb-8 text-center">GymPower</div>
      <nav className="flex flex-col space-y-2">
        {linksToShow.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
          >
            {link.icon} {link.text}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;