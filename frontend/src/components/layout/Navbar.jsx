import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-gray-700">Bienvenido, {user?.fullName || 'Admin'}</h1>
      </div>
      <button
        onClick={logout}
        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
        Cerrar Sesión
      </button>
    </header>
  );
};

export default Navbar;