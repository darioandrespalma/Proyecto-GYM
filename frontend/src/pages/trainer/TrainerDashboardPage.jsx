import React, { useState, useEffect } from 'react';
// CORRECCIÓN: Importar desde classesApi en lugar de trainerApi
import { getTrainerDashboard, getTrainerClasses } from '../../api/classesApi';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  ClockIcon, 
  UserGroupIcon, 
  CalendarDaysIcon 
} from '@heroicons/react/24/outline';

const TrainerDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [dashboardResponse, classesResponse] = await Promise.all([
          getTrainerDashboard(),
          getTrainerClasses()
        ]);
        
        setDashboardData(dashboardResponse);
        setClasses(classesResponse);
        
      } catch (err) {
        console.error('Error fetching trainer data:', err);
        setError('Error al cargar los datos. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        <h1 className="text-2xl font-bold text-gray-800">Dashboard de Entrenador</h1>
        <p className="text-sm text-gray-500">Bienvenido, {user?.fullName}</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center transition-all duration-300 hover:shadow-lg">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Clases de Hoy</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{dashboardData.today_classes || 0}</p>
          </Card>
          
          <Card className="p-6 text-center transition-all duration-300 hover:shadow-lg">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <CalendarDaysIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Próximas Clases</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{dashboardData.upcoming_classes || 0}</p>
          </Card>
          
          <Card className="p-6 text-center transition-all duration-300 hover:shadow-lg">
            <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Alumnos Únicos</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">{dashboardData.unique_members || 0}</p>
          </Card>
        </div>
      )}
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Mis Clases Programadas</h2>
        
        {classes && classes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clase</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha y Hora</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {classes.map((classItem) => (
                  <tr key={classItem.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{classItem.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(classItem.date_time).toLocaleDateString()} -{' '}
                      {new Date(classItem.date_time).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.duration_minutes} min</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{classItem.max_capacity} personas</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No tienes clases programadas.</p>
        )}
      </Card>
    </div>
  );
};

export default TrainerDashboardPage;