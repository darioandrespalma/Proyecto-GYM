import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  UserPlusIcon, 
  CurrencyDollarIcon, 
  ClipboardDocumentListIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { getDashboardData } from '../../api/dashboardApi';
import { useAuthStore } from '../../store/useAuthStore';

const WelcomeBanner = ({ adminName }) => (
  <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 p-8 rounded-2xl shadow-xl overflow-hidden mb-8 animate-glow">
    <div className="relative z-10">
      <h2 className="text-3xl font-bold text-white">¡Bienvenido de nuevo, {adminName}!</h2>
      <p className="mt-2 text-blue-100">Aquí tienes un resumen del rendimiento de GymPower.</p>
    </div>
    <div className="absolute -right-8 -bottom-10 h-40 w-40 opacity-20">
      <div className="w-full h-full bg-white rounded-full filter blur-xl"></div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusStyles = {
    completed: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
    pending: 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white animate-pulse',
    rejected: 'bg-gradient-to-r from-red-500 to-rose-600 text-white',
  };

  const statusIcons = {
    completed: '✅',
    pending: '⏳',
    rejected: '❌'
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      {statusIcons[status] || '❓'} {status}
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

    if (loading) return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
    
    if (!data) return <p className="text-center text-red-500">No se pudieron cargar los datos del dashboard.</p>;

    const { stats, recentActivity } = data;

    const statCards = [
        { 
          title: 'Miembros Totales', 
          value: stats.totalMembers, 
          icon: <UsersIcon className="h-8 w-8" />, 
          color: 'bg-gradient-to-br from-blue-500 to-blue-700',
          trend: '+12%'
        },
        { 
          title: 'Nuevos Miembros', 
          value: stats.newMembers, 
          icon: <UserPlusIcon className="h-8 w-8" />, 
          color: 'bg-gradient-to-br from-green-500 to-green-700',
          trend: '+5%'
        },
        { 
          title: 'Ingresos Mensuales', 
          value: `$${stats.monthlyIncome}`, 
          icon: <CurrencyDollarIcon className="h-8 w-8" />, 
          color: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
          trend: '+8%'
        },
        { 
          title: 'Clases Programadas', 
          value: stats.scheduledClasses, 
          icon: <ClipboardDocumentListIcon className="h-8 w-8" />, 
          color: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
          trend: '+3%'
        },
    ];

    return (
        <div className="space-y-8">
            <WelcomeBanner adminName={adminName || 'Admin'} />

            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Métricas Clave</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <Card 
                          key={stat.title} 
                          className="text-center transition-all duration-300 hover:transform hover:scale-105 group relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className={`inline-flex items-center justify-center p-3 rounded-2xl ${stat.color} text-white mb-4 group-hover:animate-pulse`}>
                              {stat.icon}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                          <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
                          <div className="mt-4 flex items-center justify-center text-green-500 text-sm">
                              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                              <span>{stat.trend}</span>
                          </div>
                        </Card>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Actividad Reciente</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="transition-all duration-300 hover:shadow-xl">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                          <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-500" />
                          Pagos Recientes
                        </h3>
                        <ul className="space-y-4">
                            {recentActivity.payments.map(payment => (
                                <li key={payment.id} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-b-0">
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
                    </Card>

                    <Card className="transition-all duration-300 hover:shadow-xl">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                          <UsersIcon className="h-5 w-5 mr-2 text-green-500" />
                          Nuevos Miembros
                        </h3>
                        <ul className="space-y-3">
                            {recentActivity.members.map(member => (
                                <li key={member.id} className="pb-3 border-b border-gray-100 last:border-b-0">
                                    <p className="font-medium text-gray-800">{member.full_name}</p>
                                    <p className="text-sm text-gray-500">{member.email}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Registrado el: {new Date(member.registration_date).toLocaleDateString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;