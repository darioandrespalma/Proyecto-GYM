import React, { useState, useEffect } from 'react';
import { getTrainerClasses, getClassMembers, takeAttendance } from '../../api/trainerApi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import { UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline';

const TrainerClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classMembers, setClassMembers] = useState([]);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const data = await getTrainerClasses();
      setClasses(data);
    } catch (error) {
      console.error('Error loading classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClassMembers = async (classId) => {
    try {
      const data = await getClassMembers(classId);
      setClassMembers(data);
      setSelectedClass(classId);
    } catch (error) {
      console.error('Error loading class members:', error);
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
      <h1 className="text-2xl font-bold text-gray-800">Mis Clases</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
            Clases Asignadas
          </h2>
          
          {classes.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-500">No tienes clases asignadas.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {classes.map((classItem) => (
                <Card key={classItem.id} className="p-4 transition-all duration-300 hover:shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-800">{classItem.name}</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>{new Date(classItem.date_time).toLocaleDateString()} - {new Date(classItem.date_time).toLocaleTimeString()}</p>
                    <p>Duración: {classItem.duration_minutes} min</p>
                    <p>Capacidad: {classItem.max_capacity} personas</p>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Button 
                      color="primary" 
                      size="sm"
                      onClick={() => loadClassMembers(classItem.id)}
                    >
                      Ver Inscritos
                    </Button>
                    <Button 
                      color="secondary" 
                      size="sm"
                      onClick={() => {
                        setSelectedClass(classItem.id);
                        setAttendanceModalOpen(true);
                      }}
                    >
                      Tomar Asistencia
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-2 text-green-500" />
            {selectedClass ? 'Alumnos Inscritos' : 'Selecciona una clase'}
          </h2>
          
          {classMembers.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-500">
                {selectedClass ? 'No hay alumnos inscritos en esta clase.' : 'Selecciona una clase para ver los alumnos inscritos.'}
              </p>
            </Card>
          ) : (
            <Card className="p-4">
              <ul className="divide-y divide-gray-200">
                {classMembers.map((member) => (
                  <li key={member.id} className="py-3">
                    <p className="text-gray-800 font-medium">{member.full_name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>

      <Modal 
        isOpen={attendanceModalOpen} 
        onClose={() => setAttendanceModalOpen(false)}
        title="Tomar Asistencia"
      >
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
                  className="h-4 w-4 text-blue-600 rounded"
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
              onClick={() => setAttendanceModalOpen(false)}
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
      </Modal>
    </div>
  );
};

export default TrainerClassesPage;