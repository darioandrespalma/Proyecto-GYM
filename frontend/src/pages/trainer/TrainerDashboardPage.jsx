import React, { useState, useEffect } from 'react';
import { getTrainerDashboard, getTrainerClasses } from '../../api/classesApi';
import { useAuthStore } from '../../store/useAuthStore';

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
        
        // Realizar ambas peticiones en paralelo
        const [dashboardResponse, classesResponse] = await Promise.all([
          getTrainerDashboard(),
          getTrainerClasses()
        ]);
        
        // Verificar que las respuestas tengan datos
        if (dashboardResponse) {
          setDashboardData(dashboardResponse);
        }
        
        if (Array.isArray(classesResponse)) {
          setClasses(classesResponse);
        } else {
          setClasses([]);
        }
        
      } catch (err) {
        console.error('Error fetching trainer data:', err);
        setError('Error al cargar los datos. Por favor, intenta nuevamente.');
        setDashboardData(null);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando información de la clase...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard de Entrenador</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {dashboardData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-100 p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-blue-800">Clases de Hoy</h3>
            <p className="text-3xl font-bold text-blue-600">{dashboardData.today_classes || 0}</p>
          </div>
          
          <div className="bg-green-100 p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-green-800">Próximas Clases</h3>
            <p className="text-3xl font-bold text-green-600">{dashboardData.upcoming_classes || 0}</p>
          </div>
          
          <div className="bg-purple-100 p-6 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-purple-800">Alumnos Únicos</h3>
            <p className="text-3xl font-bold text-purple-600">{dashboardData.unique_members || 0}</p>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-100 p-4 rounded-lg mb-6">
          <p className="text-yellow-800">No se pudieron cargar los datos del dashboard.</p>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mis Clases Programadas</h2>
        
        {classes && classes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Clase</th>
                  <th className="px-4 py-2 text-left">Fecha y Hora</th>
                  <th className="px-4 py-2 text-left">Duración</th>
                  <th className="px-4 py-2 text-left">Capacidad</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classItem) => (
                  <tr key={classItem.id} className="border-b">
                    <td className="px-4 py-2">{classItem.name}</td>
                    <td className="px-4 py-2">
                      {new Date(classItem.date_time).toLocaleDateString()} -{' '}
                      {new Date(classItem.date_time).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-2">{classItem.duration_minutes} min</td>
                    <td className="px-4 py-2">{classItem.max_capacity} personas</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No tienes clases programadas.</p>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboardPage;