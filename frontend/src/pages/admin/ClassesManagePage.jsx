import React, { useState, useEffect } from 'react';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';
import { getClasses, createClass } from '../../api/classesApi'; // Importar ambas funciones

const ClassesManagePage = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estado para manejar los datos del formulario
    const [newClass, setNewClass] = useState({
        name: '',
        trainer_id: '',
        date_time: '',
        duration_minutes: '',
        max_capacity: ''
    });

    // Función para cargar las clases desde la API
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
        // Limpiar el formulario al cerrar
        setNewClass({ name: '', trainer_id: '', date_time: '', duration_minutes: '', max_capacity: '' });
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        // Convertir a número si es necesario
        const finalValue = id === 'trainer_id' || id === 'duration_minutes' || id === 'max_capacity'
            ? parseInt(value, 10)
            : value;
        setNewClass({ ...newClass, [id]: finalValue });
    };

    // Función para guardar la nueva clase
    const handleSaveClass = async (e) => {
        e.preventDefault();
        try {
            // Llamar a la API para crear la clase
            await createClass(newClass);
            // Refrescar la lista de clases para mostrar la nueva
            fetchClasses();
            handleCloseModal();
        } catch (error) {
            console.error("Error al crear la clase:", error);
            // Aquí podrías mostrar un mensaje de error en el modal
            alert("Error al crear la clase. Revisa la consola para más detalles.");
        }
    };

    const columns = [
        { Header: 'Nombre Clase', accessor: 'name' },
        // El backend devuelve el objeto 'trainer' anidado
        { Header: 'Entrenador', accessor: 'trainer', Cell: ({ row }) => row.trainer.full_name },
        { Header: 'Fecha y Hora', accessor: 'date_time', Cell: ({ row }) => new Date(row.date_time).toLocaleString('es-ES') },
        { Header: 'Duración (min)', accessor: 'duration_minutes' },
        { Header: 'Capacidad', accessor: 'max_capacity' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Clases</h1>
                <Button color="primary" onClick={handleOpenModal}>
                    Agregar Nueva Clase
                </Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {loading ? <Spinner /> : <Table columns={columns} data={classes} />}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Agregar Nueva Clase">
                <form onSubmit={handleSaveClass} className="space-y-4">
                    <Input id="name" label="Nombre de la Clase" value={newClass.name} onChange={handleInputChange} required />
                    <Input id="trainer_id" label="ID del Entrenador" type="number" value={newClass.trainer_id} onChange={handleInputChange} required />
                    <Input id="date_time" label="Fecha y Hora" type="datetime-local" value={newClass.date_time} onChange={handleInputChange} required />
                    <Input id="duration_minutes" label="Duración (minutos)" type="number" value={newClass.duration_minutes} onChange={handleInputChange} required />
                    <Input id="max_capacity" label="Capacidad Máxima" type="number" value={newClass.max_capacity} onChange={handleInputChange} required />
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" color="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button type="submit" color="primary">Guardar Clase</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ClassesManagePage;
