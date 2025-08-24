import React from 'react';
import { UsersIcon, CurrencyDollarIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Card from '../../components/common/Card';

const AdminDashboardPage = () => {
  // En un proyecto real, estos datos vendrían de la API
  const stats = [
    { title: 'Miembros Totales', value: '152', icon: <UsersIcon className="h-8 w-8" />, color: 'bg-blue-500' },
    { title: 'Ingresos este mes', value: '$4,580', icon: <CurrencyDollarIcon className="h-8 w-8" />, color: 'bg-green-500' },
    { title: 'Clases Programadas', value: '25', icon: <ClipboardDocumentListIcon className="h-8 w-8" />, color: 'bg-indigo-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(stat => <Card key={stat.title} {...stat} />)}
      </div>
      {/* Aquí irían los componentes de Actividad Reciente */}
    </div>
  );
};

export default AdminDashboardPage;