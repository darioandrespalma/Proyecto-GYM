import React, { useState, useEffect } from 'react';
import { getTrainerDashboard, getTrainerClasses, getClassMembers, takeAttendance } from '../../api/classesApi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  ClockIcon, 
  UserGroupIcon, 
  CalendarDaysIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const TrainerDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [classes, setClasses] = useState([]);
  const [classMembers, setClassMembers] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [viewMembersModalOpen, setViewMembersModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
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

  const loadClassMembers = async (classId) => {
    try {
      setMembersLoading(true);
      const data = await getClassMembers(classId);
      setClassMembers(data);
      setSelectedClass(classId);
    } catch (error) {
      console.error('Error loading class members:', error);
      setError('Error al cargar los miembros de la clase.');
    } finally {
      setMembersLoading(false);
    }
  };

  const handleAttendance = async () => {
    try {
      await takeAttendance(selectedClass, selectedMembers);
      setAttendanceModalOpen(false);
      setSelectedMembers([]);
      alert('Asistencia registrada correctamente');
    } catch (error) {
      console.error('Error taking attendance:', error);
      alert('Error al registrar la asistencia');
    }
  };

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Button 
                          color="primary" 
                          size="sm"
                          onClick={() => {
                            loadClassMembers(classItem.id);
                            setViewMembersModalOpen(true);
                          }}
                        >
                          Ver Inscritos
                        </Button>
                        <Button 
                          color="secondary" 
                          size="sm"
                          onClick={() => {
                            loadClassMembers(classItem.id);
                            setAttendanceModalOpen(true);
                          }}
                        >
                          Tomar Asistencia
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No tienes clases programadas.</p>
        )}
      </Card>

      {/* Modal para ver miembros inscritos */}
      <Modal 
        isOpen={viewMembersModalOpen} 
        onClose={() => setViewMembersModalOpen(false)}
        title="Alumnos Inscritos"
      >
        {membersLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner />
          </div>
        ) : (
          <div>
            {classMembers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay alumnos inscritos en esta clase.</p>
            ) : (
              <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                {classMembers.map((member) => (
                  <li key={member.id} className="py-3 flex items-center">
                    <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-gray-800 font-medium">{member.full_name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Modal>

      {/* Modal para tomar asistencia */}
      <Modal 
        isOpen={attendanceModalOpen} 
        onClose={() => {
          setAttendanceModalOpen(false);
          setSelectedMembers([]);
        }}
        title="Tomar Asistencia"
      >
        {membersLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700">Selecciona los miembros que asistieron a la clase:</p>
            
            <div className="max-h-60 overflow-y-auto">
              {classMembers.map((member) => (
                <div key={member.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    id={`member-${member.id}`}
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => toggleMemberSelection(member.id)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor={`member-${member.id}`} className="ml-2 block text-sm text-gray-700">
                    {member.full_name}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                color="secondary" 
                onClick={() => {
                  setAttendanceModalOpen(false);
                  setSelectedMembers([]);
                }}
              >
                Cancelar
              </Button>
              <Button 
                color="primary" 
                onClick={handleAttendance}
                disabled={selectedMembers.length === 0}
              >
                Registrar Asistencia
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TrainerDashboardPage;