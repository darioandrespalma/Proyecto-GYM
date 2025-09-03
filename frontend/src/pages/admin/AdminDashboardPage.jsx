// frontend/src/pages/admin/AdminDashboardPage.jsx (VERSIÓN REDISEÑADA)

import React, { useState, useEffect } from 'react';
import { UsersIcon, UserPlusIcon, CurrencyDollarIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { getDashboardData } from '../../api/dashboardApi';
import { useAuthStore } from '../../store/useAuthStore';

// --- NUEVO COMPONENTE: Banner de Bienvenida ---
const WelcomeBanner = ({ adminName }) => (
    <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white">¡Bienvenido de nuevo, {adminName}!</h2>
            <p className="mt-2 text-blue-100">Aquí tienes un resumen del rendimiento de GymPower.</p>
        </div>
        {/* Usamos la URL de nuestro nuevo endpoint del backend */}
        <img 
            src="http://127.0.0.1:8000/api/v1/assets/gym-icon.svg" 
            alt="Gym Icon"
            className="absolute -right-8 -bottom-10 h-40 w-40 opacity-20 transform rotate-12"
        />
    </div>
);


// --- Componente de ayuda para las insignias de estado (sin cambios) ---
const StatusBadge = ({ status }) => {
    const statusStyles = {
        completed: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        rejected: 'bg-red-100 text-red-800',
    };
    const statusText = {
        completed: 'Completado',
        pending: 'Pendiente',
        rejected: 'Rechazado',
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {statusText[status] || status}
        </span>
    );
};


const AdminDashboardPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const adminName = useAuthStore((state) => state.user?.fullName);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseData = await getDashboardData();
                setData(responseData);
            } catch (error) {
                console.error("Error al cargar los datos del dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Spinner />;
    if (!data) return <p className="text-center text-red-500">No se pudieron cargar los datos del dashboard.</p>;

    const { stats, recentActivity } = data;

    const statCards = [
        { title: 'Miembros Totales', value: stats.totalMembers, icon: <UsersIcon className="h-8 w-8" />, color: 'bg-blue-500' },
        { title: 'Nuevos Miembros (Mes)', value: stats.newMembers, icon: <UserPlusIcon className="h-8 w-8" />, color: 'bg-green-500' },
        { title: 'Ingresos este mes', value: `$${stats.monthlyIncome}`, icon: <CurrencyDollarIcon className="h-8 w-8" />, color: 'bg-yellow-500' },
        { title: 'Clases Programadas', value: stats.scheduledClasses, icon: <ClipboardDocumentListIcon className="h-8 w-8" />, color: 'bg-indigo-500' },
    ];

    return (
        <div className="space-y-8">
            {/* --- SECCIÓN DEL BANNER --- */}
            <WelcomeBanner adminName={adminName || 'Admin'} />

            {/* --- SECCIÓN DE TARJETAS DE ESTADÍSTICAS --- */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Métricas Clave</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map(stat => <Card key={stat.title} {...stat} />)}
                </div>
            </div>

            {/* --- SECCIÓN DE ACTIVIDAD RECIENTE --- */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Actividad Reciente</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* --- LISTA DE PAGOS RECIENTES --- */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Pagos Recientes</h3>
                        <ul className="space-y-4">
                            {recentActivity.payments.map(payment => (
                                <li key={payment.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                                    <div>
                                        <p className="font-medium text-gray-800">{payment.user?.full_name || 'Usuario desconocido'}</p>
                                        <p className="text-sm text-gray-500">{payment.membership_type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">${payment.amount.toFixed(2)}</p>
                                        <StatusBadge status={payment.status} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* --- LISTA DE NUEVOS MIEMBROS --- */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Nuevos Miembros</h3>
                        <ul className="space-y-3">
                            {recentActivity.members.map(member => (
                                <li key={member.id} className="border-b pb-2 last:border-b-0">
                                    <p className="font-medium text-gray-800">{member.full_name}</p>
                                    <p className="text-sm text-gray-500">{member.email}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Registrado el: {new Date(member.registration_date).toLocaleDateString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;