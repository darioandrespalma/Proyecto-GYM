// frontend/src/pages/trainer/TrainerDashboardPage.jsx (MODIFICADO)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, UserGroupIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import Card from '../../components/common/Card';
import { getTrainerClasses } from '../../api/trainerApi'; // Importar la función de la API
import { dateFormatter } from '../../utils/dateFormatter'; // Asumiendo que tienes este util

const TrainerDashboardPage = () => {
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await getTrainerClasses();
                // La respuesta ahora incluye el array de bookings, podemos calcular los inscritos
                const classesWithAttendees = response.data.map(cls => ({
                    ...cls,
                    attendees: cls.bookings.length // Calculamos los inscritos
                }));
                setUpcomingClasses(classesWithAttendees);
            } catch (err) {
                setError('No se pudieron cargar las clases. Inténtalo de nuevo más tarde.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    const stats = [
        { title: 'Clases Hoy', value: upcomingClasses.length, icon: <ClockIcon className="h-8 w-8" />, color: 'bg-blue-500' },
        { title: 'Total Inscritos Hoy', value: upcomingClasses.reduce((sum, cls) => sum + cls.attendees, 0), icon: <UserGroupIcon className="h-8 w-8" />, color: 'bg-green-500' },
    ];

    if (loading) return <p>Cargando panel...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Entrenador</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {stats.map(stat => <Card key={stat.title} {...stat} />)}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Próximas Clases del Día</h2>
                <div className="space-y-4">
                    {upcomingClasses.length > 0 ? (
                        upcomingClasses.map((cls) => (
                            <div key={cls.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                <div>
                                    <p className="font-bold text-lg text-gray-800">{cls.name}</p>
                                    {/* Usamos el formateador de fechas */}
                                    <p className="text-sm text-gray-500">
                                        Hora: {dateFormatter(cls.date_time, { hour: '2-digit', minute: '2-digit' })} | Inscritos: {cls.attendees}/{cls.max_capacity}
                                    </p>
                                </div>
                                <Link
                                    to={`/trainer/attendance/${cls.id}`}
                                    className="flex items-center px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
                                >
                                    <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2" />
                                    Tomar Asistencia
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No tienes clases asignadas para hoy.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrainerDashboardPage;