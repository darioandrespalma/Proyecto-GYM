import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { ClockIcon, UserIcon, UsersIcon } from '@heroicons/react/24/outline';

const SchedulePage = () => {
    // Estado para manejar las reservas, simulando qué clases ya reservó el usuario
    const [bookedClasses, setBookedClasses] = useState(new Set());

    // Datos de ejemplo que vendrían de la API
    const schedule = [
        { id: 1, name: 'Yoga Matutino', trainer: 'Ana Fuentes', time: '08:00 AM', duration: 60, spotsLeft: 3 },
        { id: 2, name: 'HIIT Intenso', trainer: 'Carlos Roca', time: '10:00 AM', duration: 45, spotsLeft: 5 },
        { id: 3, name: 'Boxeo Fitness', trainer: 'David Ortiz', time: '04:00 PM', duration: 60, spotsLeft: 8 },
        { id: 4, name: 'Spinning Rítmico', trainer: 'Sofia Solis', time: '06:00 PM', duration: 50, spotsLeft: 0 },
        { id: 5, name: 'Pilates', trainer: 'Ana Fuentes', time: '07:00 PM', duration: 60, spotsLeft: 10 },
    ];

    const handleBooking = (classId) => {
        setBookedClasses(prev => {
            const newSet = new Set(prev);
            if (newSet.has(classId)) {
                newSet.delete(classId); // Permitir cancelar reserva
            } else {
                newSet.add(classId); // Reservar
            }
            return newSet;
        });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Horario de Clases - Hoy</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-4">
                    {schedule.map((cls) => {
                        const isBooked = bookedClasses.has(cls.id);
                        const isFull = cls.spotsLeft === 0;

                        return (
                            <div key={cls.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-gray-800">{cls.name}</h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
                                        <span className="flex items-center"><ClockIcon className="h-4 w-4 mr-1.5" />{cls.time} ({cls.duration} min)</span>
                                        <span className="flex items-center"><UserIcon className="h-4 w-4 mr-1.5" />{cls.trainer}</span>
                                        <span className="flex items-center"><UsersIcon className="h-4 w-4 mr-1.5" />{cls.spotsLeft} cupos disponibles</span>
                                    </div>
                                </div>
                                <Button
                                    color={isBooked ? 'secondary' : 'primary'}
                                    onClick={() => handleBooking(cls.id)}
                                    disabled={isFull && !isBooked}
                                    className="w-full sm:w-auto flex-shrink-0"
                                >
                                    {isBooked ? 'Cancelar Reserva' : (isFull ? 'Clase Llena' : 'Reservar Lugar')}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SchedulePage;