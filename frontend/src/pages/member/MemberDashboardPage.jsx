import React, { useState, useEffect } from 'react';
import { getMemberDashboard } from '../../api/memberApi';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { ClockIcon, UserCircleIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/useAuthStore';

const MemberDashboardPage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await getMemberDashboard();
                setDashboardData(response);
            } catch (error) {
                console.error("Error al cargar el dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Mi Panel</h1>
                <p className="text-sm text-gray-500">Bienvenido, {user?.fullName}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 text-center transition-all duration-300 hover:shadow-lg">
                    <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <UserCircleIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Estado de Membresía</h3>
                    <p className="text-2xl font-bold text-blue-600 mt-2 capitalize">{dashboardData?.membership_status}</p>
                </Card>

                <Card className="p-6 text-center transition-all duration-300 hover:shadow-lg">
                    <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <ClockIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Días Restantes</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">{dashboardData?.days_remaining}</p>
                </Card>

                <Card className="p-6 text-center transition-all duration-300 hover:shadow-lg">
                    <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <UsersIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Clases Reservadas</h3>
                    <p className="text-2xl font-bold text-purple-600 mt-2">{dashboardData?.upcoming_classes_count}</p>
                </Card>
            </div>

            <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Actividad</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-700">Próxima Clase</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {dashboardData?.next_class 
                                ? `${dashboardData.next_class.name} - ${new Date(dashboardData.next_class.date_time).toLocaleDateString()}`
                                : 'No tienes clases programadas'
                            }
                        </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-700">Último Pago</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {dashboardData?.last_payment 
                                ? `$${dashboardData.last_payment.amount} - ${new Date(dashboardData.last_payment.date).toLocaleDateString()}`
                                : 'Sin información de pago'
                            }
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MemberDashboardPage;