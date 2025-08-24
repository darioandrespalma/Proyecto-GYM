import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon
} from '@heroicons/react/24/solid';

const Sidebar = () => {
  const linkClasses = "flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors";
  const activeLinkClasses = "bg-blue-600 text-white";

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <div className="text-2xl font-bold mb-8 text-center">GymPower</div>
      <nav className="flex flex-col space-y-2">
        <NavLink to="/admin/dashboard" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <ChartBarIcon className="h-6 w-6 mr-3" /> Dashboard
        </NavLink>
        <NavLink to="/admin/members" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <UsersIcon className="h-6 w-6 mr-3" /> Miembros
        </NavLink>
        <NavLink to="/admin/payments" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <CurrencyDollarIcon className="h-6 w-6 mr-3" /> Pagos
        </NavLink>
        <NavLink to="/admin/classes" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <ClipboardDocumentListIcon className="h-6 w-6 mr-3" /> Clases
        </NavLink>
        <NavLink to="/admin/trainers" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
          <UserGroupIcon className="h-6 w-6 mr-3" /> Entrenadores
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;