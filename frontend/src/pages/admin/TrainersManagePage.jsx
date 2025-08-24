import React, { useState, useEffect } from 'react';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';

const TrainersManagePage = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Simula la carga de datos
    useEffect(() => {
        const mockData = [
            { id: 1, full_name: 'Ana Fuentes', email: 'ana.f@gym.com', specialty: 'Yoga, Pilates', experience: 5 },
            { id: 2, full_name: 'Carlos Roca', email: 'carlos.r@gym.com', specialty: 'HIIT, CrossFit', experience: 8 },
            { id: 3, full_name: 'Sofia Solis', email: 'sofia.s@gym.com', specialty: 'Spinning, Cardio', experience: 3 },
        ];
        setTimeout(() => { setTrainers(mockData); setLoading(false); }, 500);
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSaveTrainer = (e) => {
        e.preventDefault();
        // Lógica para guardar el nuevo entrenador (llamada a la API)
        console.log("Guardando entrenador...");
        handleCloseModal();
    };

    const columns = [
        { Header: 'Nombre Completo', accessor: 'full_name' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Especialidad', accessor: 'specialty' },
        { Header: 'Años Exp.', accessor: 'experience' },
        {
            Header: 'Acciones',
            accessor: 'id',
            Cell: ({ value }) => (
                <div className="flex space-x-2">
                    <Button color="secondary" onClick={() => alert(`Editando entrenador ${value}`)}>Editar</Button>
                    <Button color="danger" onClick={() => alert(`Eliminando entrenador ${value}`)}>Eliminar</Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Entrenadores</h1>
                <Button color="primary" onClick={handleOpenModal}>
                    Agregar Nuevo Entrenador
                </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {loading ? <Spinner /> : <Table columns={columns} data={trainers} />}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Agregar Nuevo Entrenador">
                <form onSubmit={handleSaveTrainer} className="space-y-4">
                    <Input id="fullName" label="Nombre Completo" required />
                    <Input id="email" label="Email" type="email" required />
                    <Input id="specialty" label="Especialidad" placeholder="Ej: CrossFit, Yoga" required />
                    <Input id="experience" label="Años de Experiencia" type="number" required />
                    <Input id="password" label="Contraseña Temporal" type="password" required />
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" color="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button type="submit" color="primary">Guardar Entrenador</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TrainersManagePage;