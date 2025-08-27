// frontend/src/pages/member/SchedulePage.jsx (MODIFICADO)

import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import { ClockIcon, UserIcon, UsersIcon } from '@heroicons/react/24/outline';
import { getSchedule, bookClass, cancelBooking } from '../../api/memberApi';
import { dateFormatter } from '../../utils/dateFormatter';
import { useAuthStore } from '../../store/useAuthStore';

const SchedulePage = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useAuthStore(state => state.user);

    const fetchSchedule = async () => {
        try {
            const response = await getSchedule();
            setSchedule(response.data);
        } catch (error) {
            console.error("Error al cargar el horario:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const handleBooking = async (classId, isBooked) => {
        try {
            if (isBooked) {
                await cancelBooking(classId);
            } else {
                await bookClass(classId);
            }
            // Recargar el horario para mostrar los cambios
            fetchSchedule(); 
        } catch (error) {
            alert(error.response?.data?.detail || "Ocurrió un error.");
        }
    };

    if (loading) return <p>Cargando horario...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Horario de Clases</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-4">
                    {schedule.map((cls) => {
                        const isBooked = cls.bookings.some(booking => booking.member_id === user.id);
                        const spotsLeft = cls.max_capacity - cls.bookings.length;
                        const isFull = spotsLeft <= 0;

                        return (
                            <div key={cls.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-gray-800">{cls.name}</h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
                                        <span className="flex items-center"><ClockIcon className="h-4 w-4 mr-1.5" />{dateFormatter(cls.date_time, { hour: '2-digit', minute: '2-digit' })} ({cls.duration_minutes} min)</span>
                                        <span className="flex items-center"><UserIcon className="h-4 w-4 mr-1.5" />{cls.trainer.full_name}</span>
                                        <span className="flex items-center"><UsersIcon className="h-4 w-4 mr-1.5" />{spotsLeft} cupos disponibles</span>
                                    </div>
                                </div>
                                <Button
                                    color={isBooked ? 'secondary' : 'primary'}
                                    onClick={() => handleBooking(cls.id, isBooked)}
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