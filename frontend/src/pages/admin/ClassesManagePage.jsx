// src/pages/admin/ClassesManagePage.jsx (Página de Gestión de Clases Mejorada)
import React, { useState, useEffect } from 'react';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';
import { getClasses, createClass } from '../../api/classesApi';
import { PlusIcon } from '@heroicons/react/24/outline';

const ClassesManagePage = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newClass, setNewClass] = useState({
        name: '',
        trainer_id: '',
        date_time: '',
        duration_minutes: '',
        max_capacity: ''
    });

    const fetchClasses = async () => {
        try {
            const data = await getClasses();
            setClasses(data);
        } catch (error) {
            console.error("Error al obtener las clases:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewClass({ name: '', trainer_id: '', date_time: '', duration_minutes: '', max_capacity: '' });
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        const finalValue = id === 'trainer_id' || id === 'duration_minutes' || id === 'max_capacity'
            ? parseInt(value, 10)
            : value;
        setNewClass({ ...newClass, [id]: finalValue });
    };

    const handleSaveClass = async (e) => {
        e.preventDefault();
        try {
            await createClass(newClass);
            fetchClasses();
            handleCloseModal();
        } catch (error) {
            console.error("Error al crear la clase:", error);
            alert("Error al crear la clase. Revisa la consola para más detalles.");
        }
    };

    const columns = [
        { Header: 'NOMBRE CLASE', accessor: 'name' },
        { Header: 'ENTRENADOR', accessor: 'trainer', Cell: ({ row }) => row.trainer?.full_name || 'No asignado' },
        { Header: 'FECHA Y HORA', accessor: 'date_time', Cell: ({ row }) => new Date(row.date_time).toLocaleString('es-ES') },
        { Header: 'DURACIÓN (MIN)', accessor: 'duration_minutes' },
        { Header: 'CAPACIDAD', accessor: 'max_capacity' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Clases</h1>
                <Button 
                    color="primary" 
                    onClick={handleOpenModal}
                    className="flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    Agregar Nueva Clase
                </Button>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner />
                    </div>
                ) : (
                    <Table columns={columns} data={classes} />
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Agregar Nueva Clase">
                <form onSubmit={handleSaveClass} className="space-y-4">
                    <Input 
                        id="name" 
                        label="Nombre de la Clase" 
                        value={newClass.name} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <Input 
                        id="trainer_id" 
                        label="ID del Entrenador" 
                        type="number" 
                        value={newClass.trainer_id} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <Input 
                        id="date_time" 
                        label="Fecha y Hora" 
                        type="datetime-local" 
                        value={newClass.date_time} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <Input 
                        id="duration_minutes" 
                        label="Duración (minutos)" 
                        type="number" 
                        value={newClass.duration_minutes} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <Input 
                        id="max_capacity" 
                        label="Capacidad Máxima" 
                        type="number" 
                        value={newClass.max_capacity} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" color="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button type="submit" color="primary">
                            Guardar Clase
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ClassesManagePage;