import React, { useState, useEffect } from 'react';
import { getAvailableClasses, bookClass, cancelBooking } from '../../api/memberApi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { CheckCircleIcon, XCircleIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';

const ClassesPage = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        try {
            setLoading(true);
            const data = await getAvailableClasses();
            setClasses(data);
        } catch (err) {
            setError('Error al cargar las clases');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBookClass = async (classId) => {
        try {
            await bookClass(classId);
            loadClasses();
        } catch (err) {
            setError('Error al reservar la clase');
            console.error(err);
        }
    };

    const handleCancelBooking = async (classId) => {
        try {
            await cancelBooking(classId);
            loadClasses();
        } catch (err) {
            setError('Error al cancelar la reserva');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Clases Disponibles</h1>
            
            {classes.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-gray-500">No hay clases disponibles en este momento.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((classItem) => (
                        <Card key={classItem.id} className="p-6 transition-all duration-300 hover:shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">{classItem.name}</h3>
                            
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <ClockIcon className="h-4 w-4 mr-2" />
                                    <span>
                                        {new Date(classItem.date_time).toLocaleDateString()} -{' '}
                                        {new Date(classItem.date_time).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <ClockIcon className="h-4 w-4 mr-2" />
                                    <span>Duración: {classItem.duration_minutes} minutos</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <UserIcon className="h-4 w-4 mr-2" />
                                    <span>Entrenador: {classItem.trainer_name}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <UserIcon className="h-4 w-4 mr-2" />
                                    <span>Cupos: {classItem.available_slots} / {classItem.max_capacity}</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                {classItem.is_booked ? (
                                    <>
                                        <span className="text-green-600 flex items-center">
                                            <CheckCircleIcon className="h-5 w-5 mr-1" />
                                            Inscrito
                                        </span>
                                        <Button 
                                            color="secondary" 
                                            size="sm"
                                            onClick={() => handleCancelBooking(classItem.id)}
                                        >
                                            Cancelar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {classItem.available_slots > 0 ? (
                                            <Button 
                                                color="primary" 
                                                onClick={() => handleBookClass(classItem.id)}
                                            >
                                                Reservar
                                            </Button>
                                        ) : (
                                            <span className="text-red-600 flex items-center">
                                                <XCircleIcon className="h-5 w-5 mr-1" />
                                                Sin cupos
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClassesPage;