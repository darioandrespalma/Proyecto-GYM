import React, { useState, useEffect } from 'react';
import { UsersIcon, UserPlusIcon, CurrencyDollarIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { getDashboardData } from '../../api/dashboardApi';

const AdminDashboardPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDashboardData();
                setData(response);
            } catch (error) {
                console.error("Error al cargar los datos del dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Spinner />;
    if (!data) return <p>No se pudieron cargar los datos.</p>;

    const { stats, recentActivity } = data;

    const statCards = [
        { title: 'Miembros Totales', value: stats.totalMembers, icon: <UsersIcon className="h-8 w-8" />, color: 'bg-blue-500' },
        { title: 'Nuevos Miembros (Mes)', value: stats.newMembers, icon: <UserPlusIcon className="h-8 w-8" />, color: 'bg-green-500' },
        { title: 'Ingresos este mes', value: `$${stats.monthlyIncome}`, icon: <CurrencyDollarIcon className="h-8 w-8" />, color: 'bg-yellow-500' },
        { title: 'Clases Programadas', value: stats.scheduledClasses, icon: <ClipboardDocumentListIcon className="h-8 w-8" />, color: 'bg-indigo-500' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Administración</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map(stat => <Card key={stat.title} {...stat} />)}
            </div>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Pagos Recientes</h2>
                    {/* Componente de Pagos Recientes */}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Nuevos Miembros</h2>
                    {/* Componente de Nuevos Miembros */}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;