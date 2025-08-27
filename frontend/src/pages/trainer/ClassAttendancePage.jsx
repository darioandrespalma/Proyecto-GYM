// frontend/src/pages/trainer/ClassAttendancePage.jsx (MODIFICADO)

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getClassMembers } from '../../api/trainerApi'; // Importar la nueva función

const ClassAttendancePage = () => {
    const { classId } = useParams(); // Obtiene el ID de la clase desde la URL
    const [className, setClassName] = useState(''); // Puedes obtenerlo de la API también o pasarlo por state
    const [members, setMembers] = useState([]);
    const [presentMembers, setPresentMembers] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClassData = async () => {
            if (!classId) return;

            setLoading(true);
            try {
                const response = await getClassMembers(classId);
                // Aquí podrías hacer otra llamada para obtener el nombre de la clase si lo necesitas
                // Por ahora, asumimos que lo sabemos o lo pasamos por state
                setClassName(`Clase ID: ${classId}`); // Temporalmente
                setMembers(response.data); // Los miembros vienen de la API
            } catch (err) {
                setError('No se pudieron cargar los miembros de la clase.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchClassData();
    }, [classId]); // Se ejecuta cada vez que el classId cambie

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
        // TODO: Crear endpoint en backend para guardar la asistencia
        console.log(`Guardando asistencia para la clase ${classId}:`, Array.from(presentMembers));
        alert(`Asistencia guardada para ${presentMembers.size} de ${members.length} miembros.`);
    };

    if (loading) return <p>Cargando información de la clase...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Tomar Asistencia</h1>
            <p className="text-lg text-gray-600 mb-6">{className}</p>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-3">
                    {members.length > 0 ? (
                        members.map(member => (
                            <label key={member.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                                    checked={presentMembers.has(member.id)}
                                    onChange={() => handleAttendanceChange(member.id)}
                                />
                                {/* El nombre del miembro ahora es 'full_name' */}
                                <span className="ml-4 text-gray-700 font-medium">{member.full_name}</span>
                            </label>
                        ))
                    ) : (
                        <p className="text-gray-500">No hay miembros inscritos en esta clase.</p>
                    )}
                </div>
                <div className="mt-6 text-right">
                    <button
                        onClick={handleSaveAttendance}
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                        disabled={members.length === 0}
                    >
                        Guardar Asistencia
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassAttendancePage;