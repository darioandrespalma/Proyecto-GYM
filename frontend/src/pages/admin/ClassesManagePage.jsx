import React, { useState, useEffect } from 'react';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';

const ClassesManagePage = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Simula la carga de datos
    useEffect(() => {
        const mockData = [
            { id: 1, name: 'Yoga Matutino', trainer: 'Ana Fuentes', date: '2025-08-22', time: '08:00 AM', capacity: '12/15' },
            { id: 2, name: 'HIIT Intenso', trainer: 'Carlos Roca', date: '2025-08-22', time: '10:00 AM', capacity: '18/20' },
            { id: 3, name: 'Spinning', trainer: 'Sofia Solis', date: '2025-08-22', time: '06:00 PM', capacity: '15/15' },
        ];
        setTimeout(() => { setClasses(mockData); setLoading(false); }, 500);
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSaveClass = (e) => {
        e.preventDefault();
        // Lógica para guardar la nueva clase (llamada a la API)
        console.log("Guardando clase...");
        handleCloseModal();
    };

    const columns = [
        { Header: 'Nombre Clase', accessor: 'name' },
        { Header: 'Entrenador', accessor: 'trainer' },
        { Header: 'Fecha', accessor: 'date' },
        { Header: 'Hora', accessor: 'time' },
        { Header: 'Capacidad', accessor: 'capacity' },
        {
            Header: 'Acciones',
            accessor: 'id',
            Cell: ({ value }) => (
                <div className="flex space-x-2">
                    <Button color="secondary" onClick={() => alert(`Editando clase ${value}`)}>Editar</Button>
                    <Button color="danger" onClick={() => alert(`Eliminando clase ${value}`)}>Eliminar</Button>
                </div>
            ),
        },
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
                    <Input id="className" label="Nombre de la Clase" placeholder="Ej: Yoga Avanzado" required />
                    <Input id="trainer" label="Entrenador" placeholder="Nombre del entrenador" required />
                    <Input id="date" label="Fecha" type="date" required />
                    <Input id="time" label="Hora" type="time" required />
                    <Input id="capacity" label="Capacidad Máxima" type="number" placeholder="20" required />
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