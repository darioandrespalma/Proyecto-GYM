import React, { useState, useEffect } from 'react';
import { getTrainerClasses, getClassMembers, takeAttendance } from '../../api/classesApi';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

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
    return <div className="flex justify-center items-center h-64">Cargando clases...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Clases</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Clases Asignadas</h2>
          
          {classes.length === 0 ? (
            <p className="text-gray-500">No tienes clases asignadas.</p>
          ) : (
            <div className="space-y-4">
              {classes.map((classItem) => (
                <div key={classItem.id} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800">{classItem.name}</h3>
                  <p className="text-gray-600">
                    {new Date(classItem.date_time).toLocaleDateString()} -{' '}
                    {new Date(classItem.date_time).toLocaleTimeString()}
                  </p>
                  <p className="text-gray-600">Duración: {classItem.duration_minutes} min</p>
                  <p className="text-gray-600">Capacidad: {classItem.max_capacity} personas</p>
                  
                  <div className="mt-2 space-x-2">
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
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {selectedClass ? 'Alumnos Inscritos' : 'Selecciona una clase'}
          </h2>
          
          {classMembers.length === 0 ? (
            <p className="text-gray-500">
              {selectedClass ? 'No hay alumnos inscritos en esta clase.' : 'Selecciona una clase para ver los alumnos inscritos.'}
            </p>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <ul className="space-y-2">
                {classMembers.map((member) => (
                  <li key={member.id} className="border-b pb-2 last:border-b-0">
                    <p className="text-gray-800 font-medium">{member.full_name}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Modal para tomar asistencia */}
      <Modal 
        isOpen={attendanceModalOpen} 
        onClose={() => setAttendanceModalOpen(false)}
        title="Tomar Asistencia"
      >
        <div className="space-y-4">
          <p>Selecciona los miembros que asistieron a la clase:</p>
          
          {classMembers.map((member) => (
            <div key={member.id} className="flex items-center">
              <input
                type="checkbox"
                id={`member-${member.id}`}
                checked={selectedMembers.includes(member.id)}
                onChange={() => toggleMemberSelection(member.id)}
                className="mr-2"
              />
              <label htmlFor={`member-${member.id}`}>{member.full_name}</label>
            </div>
          ))}
          
          <div className="flex justify-end space-x-3">
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