import React, { useState, useRef } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
    ArrowRightOnRectangleIcon, 
    UserCircleIcon, 
    ChevronDownIcon,
    HomeIcon,
    CalendarDaysIcon,
    CurrencyDollarIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import GlitchText from '../common/GlitchText';

// Hook personalizado para detectar clics fuera del menú desplegable
const useClickOutside = (ref, handler) => {
    React.useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Cierra el menú si se hace clic fuera de él
    useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

    // Enlaces de navegación específicos para el rol de miembro
    const memberLinks = [
        { name: 'Mi Panel', href: '/member', icon: <HomeIcon className="h-5 w-5 mr-2" /> },
        { name: 'Horario de Clases', href: '/member/classes', icon: <CalendarDaysIcon className="h-5 w-5 mr-2" /> },
        { name: 'Renovar Membresía', href: '/member/renew-membership', icon: <CurrencyDollarIcon className="h-5 w-5 mr-2" /> },
    ];

    const profilePictureUrl = user?.profile_picture_url 
        ? `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}${user.profile_picture_url}`
        : null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center z-20 relative">
            {/* Sección Izquierda: Logo */}
            <div className="flex items-center space-x-4">

                {user?.role !== 'member' && (
                    <h1 className="text-xl font-semibold text-gray-700 hidden md:block">
                        Bienvenido, {user?.fullName || 'Usuario'}
                    </h1>
                )}
            </div>

            {/* Sección Central: Navegación para Miembros */}
            {user?.role === 'member' && (
                <nav className="hidden md:flex items-center space-x-2">
                    {memberLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.href}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                                }`
                            }
                        >
                            {link.icon}
                            {link.name}
                        </NavLink>
                    ))}
                </nav>
            )}

            {/* Sección Derecha: Menú de Perfil */}
            <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                    {profilePictureUrl ? (
                        <img src={profilePictureUrl} alt="Perfil" className="h-9 w-9 rounded-full object-cover"/>
                    ) : (
                        <UserCircleIcon className="h-9 w-9 text-gray-400" />
                    )}
                    <div className="text-left hidden md:block">
                        <p className="font-semibold text-sm text-gray-800">{user?.fullName}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Menú Desplegable */}
                <div 
                    className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 origin-top-right transition-all duration-200 ease-out z-50
                        ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                >
                    <div className="py-1">
                        {user?.role === 'member' && (
                            <Link
                                to="/member/profile"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <UserIcon className="h-5 w-5 mr-3" />
                                Mi Perfil
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;