import React from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, UserGroupIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import Card from '../../components/common/Card';

const TrainerDashboardPage = () => {
    // En una aplicación real, estos datos se obtendrían de una llamada a la API
    const upcomingClasses = [
        { id: 1, name: 'Yoga Matutino', time: '08:00 AM', attendees: 12, max: 15 },
        { id: 2, name: 'HIIT Intenso', time: '10:00 AM', attendees: 18, max: 20 },
        { id: 3, name: 'Spinning Rítmico', time: '06:00 PM', attendees: 15, max: 15 },
    ];

    const stats = [
        { title: 'Clases Hoy', value: upcomingClasses.length, icon: <ClockIcon className="h-8 w-8" />, color: 'bg-blue-500' },
        { title: 'Total Inscritos Hoy', value: upcomingClasses.reduce((sum, cls) => sum + cls.attendees, 0), icon: <UserGroupIcon className="h-8 w-8" />, color: 'bg-green-500' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de Entrenador</h1>

            {/* Tarjetas de Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {stats.map(stat => <Card key={stat.title} {...stat} />)}
            </div>

            {/* Lista de Próximas Clases */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Próximas Clases del Día</h2>
                <div className="space-y-4">
                    {upcomingClasses.map((cls) => (
                        <div key={cls.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div>
                                <p className="font-bold text-lg text-gray-800">{cls.name}</p>
                                <p className="text-sm text-gray-500">Hora: {cls.time} | Inscritos: {cls.attendees}/{cls.max}</p>
                            </div>
                            <Link 
                                to={`/trainer/attendance/${cls.id}`} // La ruta incluiría el ID de la clase
                                className="flex items-center px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
                            >
                                <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2" />
                                Tomar Asistencia
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrainerDashboardPage;