import React, { useState, useEffect } from 'react';
import { getAvailableClasses, bookClass, cancelBooking } from '../../api/classesApi';
import Button from '../../components/common/Button';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

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
            // Recargar clases para actualizar estado
            loadClasses();
        } catch (err) {
            setError('Error al reservar la clase');
            console.error(err);
        }
    };

    const handleCancelBooking = async (classId) => {
        try {
            await cancelBooking(classId);
            // Recargar clases para actualizar estado
            loadClasses();
        } catch (err) {
            setError('Error al cancelar la reserva');
            console.error(err);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64">Cargando clases...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Clases Disponibles</h1>
            
            {classes.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    <p>No hay clases disponibles en este momento.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((classItem) => (
                        <div key={classItem.id} className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{classItem.name}</h3>
                            
                            <div className="space-y-2 mb-4">
                                <p className="text-gray-600">
                                    <strong>Fecha:</strong> {new Date(classItem.date_time).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Hora:</strong> {new Date(classItem.date_time).toLocaleTimeString()}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Duración:</strong> {classItem.duration_minutes} minutos
                                </p>
                                <p className="text-gray-600">
                                    <strong>Entrenador:</strong> {classItem.trainer_name}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Cupos:</strong> {classItem.available_slots} / {classItem.max_capacity}
                                </p>
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
                                                disabled={classItem.available_slots === 0}
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClassesPage;