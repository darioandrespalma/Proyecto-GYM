import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  ChartPieIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const MemberLayout = () => {
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    // Clases para los enlaces de navegación
    const linkClasses = "flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md text-sm font-medium transition-colors";
    const activeLinkClasses = "bg-blue-100 text-blue-600";

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Barra de Navegación Superior */}
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo y Navegación Principal */}
                        <div className="flex items-center">
                            <div className="text-xl font-bold text-blue-600">
                                GymPower
                            </div>
                            <nav className="hidden md:flex md:ml-10 md:space-x-8">
                                <NavLink to="/member/dashboard" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                                    <ChartPieIcon className="h-5 w-5 mr-2" />
                                    Mi Panel
                                </NavLink>
                                <NavLink to="/member/schedule" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                                    <CalendarDaysIcon className="h-5 w-5 mr-2" />
                                    Horario de Clases
                                </NavLink>
                                <NavLink to="/member/renew" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                                    <CreditCardIcon className="h-5 w-5 mr-2" />
                                    Renovar Membresía
                                </NavLink>
                                <NavLink to="/member/profile" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                                    <UserCircleIcon className="h-5 w-5 mr-2" />
                                    Mi Perfil
                                </NavLink>
                            </nav>
                        </div>

                        {/* Saludo y Botón de Salir */}
                        <div className="flex items-center">
                            <span className="text-gray-700 mr-4 hidden sm:block">
                                Hola, <span className="font-semibold">{user?.fullName || 'Miembro'}</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-colors"
                            >
                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenido Principal de la Página */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* El componente Outlet renderiza la página actual (ej: MemberDashboardPage, SchedulePage, etc.) */}
                <Outlet />
            </main>
        </div>
    );
};

export default MemberLayout;