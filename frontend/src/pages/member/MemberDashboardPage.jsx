// frontend/src/pages/member/MemberDashboardPage.jsx (MODIFICADO)

import React, { useState, useEffect } from 'react';
import { getMemberDashboard } from '../../api/memberApi';
import { ClockIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const MemberDashboardPage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await getMemberDashboard();
                setDashboardData(response.data);
            } catch (error) {
                console.error("Error al cargar el dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <p>Cargando tu panel...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi Panel</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Bienvenido, {dashboardData?.full_name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-blue-100 rounded-lg">
                        <UserCircleIcon className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                        <p className="font-semibold">Estado de Membresía</p>
                        <p className="capitalize text-blue-700 font-bold">{dashboardData?.membership_status}</p>
                    </div>
                    <div className="p-4 bg-green-100 rounded-lg">
                        <ClockIcon className="h-8 w-8 mx-auto text-green-500 mb-2" />
                        <p className="font-semibold">Días Restantes</p>
                        <p className="text-green-700 font-bold">{dashboardData?.days_remaining}</p>
                    </div>
                    <div className="p-4 bg-indigo-100 rounded-lg">
                        <p className="text-3xl font-bold text-indigo-700">{dashboardData?.upcoming_classes_count}</p>
                        <p className="font-semibold text-indigo-500">Clases Reservadas</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberDashboardPage;