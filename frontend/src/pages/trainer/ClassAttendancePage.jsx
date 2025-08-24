import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ClassAttendancePage = () => {
    // useParams() se usaría para obtener el ID de la clase desde la URL. ej: const { classId } = useParams();
    const [className, setClassName] = useState('');
    const [members, setMembers] = useState([]);
    const [presentMembers, setPresentMembers] = useState(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulación de llamada a la API para obtener los detalles de la clase y los miembros
        const fetchClassData = () => {
            setLoading(true);
            // Datos de ejemplo
            setClassName('Yoga Matutino - 08:00 AM');
            const mockMembers = [
                { id: 101, name: 'Ana Martínez' },
                { id: 102, name: 'Carlos Sanchez' },
                { id: 103, name: 'Laura Gómez' },
                { id: 104, name: 'Pedro Rodriguez' },
            ];
            setMembers(mockMembers);
            setLoading(false);
        };
        fetchClassData();
    }, []); // El array vacío asegura que se ejecute solo una vez

    // Maneja el cambio de estado de la asistencia
    const handleAttendanceChange = (memberId) => {
        setPresentMembers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(memberId)) {
                newSet.delete(memberId);
            } else {
                newSet.add(memberId);
            }
            return newSet;
        });
    };

    const handleSaveAttendance = () => {
        // En una aplicación real, aquí se enviaría la información a la API
        console.log('Asistencia guardada:', Array.from(presentMembers));
        alert(`Asistencia guardada para ${presentMembers.size} de ${members.length} miembros.`);
    };

    if (loading) return <p>Cargando información de la clase...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Tomar Asistencia</h1>
            <p className="text-lg text-gray-600 mb-6">{className}</p>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-3">
                    {members.map(member => (
                        <label key={member.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                                type="checkbox"
                                className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                                checked={presentMembers.has(member.id)}
                                onChange={() => handleAttendanceChange(member.id)}
                            />
                            <span className="ml-4 text-gray-700 font-medium">{member.name}</span>
                        </label>
                    ))}
                </div>
                <div className="mt-6 text-right">
                    <button
                        onClick={handleSaveAttendance}
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                    >
                        Guardar Asistencia
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassAttendancePage;