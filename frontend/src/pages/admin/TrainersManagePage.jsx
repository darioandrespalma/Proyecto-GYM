// frontend/src/pages/admin/TrainersManagePage.jsx (MODIFICADO)

import React, { useState, useEffect } from 'react';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';
import { getTrainers, createTrainer } from '../../api/trainersApi';

const TrainersManagePage = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTrainer, setNewTrainer] = useState({
        full_name: '',
        email: '',
        password: '',
        role: 'trainer'
    });

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const data = await getTrainers();
                setTrainers(data);
            } catch (error) {
                console.error("Error al obtener los entrenadores:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrainers();
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewTrainer({ full_name: '', email: '', password: '', role: 'trainer' });
    };

    const handleInputChange = (e) => {
        setNewTrainer({ ...newTrainer, [e.target.id]: e.target.value });
    };

    const handleSaveTrainer = async (e) => {
        e.preventDefault();
        try {
            const createdTrainer = await createTrainer(newTrainer);
            setTrainers([...trainers, createdTrainer]);
            handleCloseModal();
        } catch (error) {
            console.error("Error al crear el entrenador:", error);
        }
    };

    // --- SECCIÓN MODIFICADA ---
    const columns = [
        // --- LÍNEA AÑADIDA ---
        { Header: 'ID', accessor: 'id' }, // Le decimos a la tabla que muestre la columna 'id'
        { Header: 'Nombre Completo', accessor: 'full_name' },
        { Header: 'Email', accessor: 'email' },
        {
            Header: 'Acciones',
            accessor: 'actions', // El accesor puede ser cualquier cosa si usas Cell
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Button color="secondary" size="sm">Editar</Button>
                    <Button color="danger" size="sm">Eliminar</Button>
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
                    <Input id="full_name" label="Nombre Completo" value={newTrainer.full_name} onChange={handleInputChange} required />
                    <Input id="email" label="Email" type="email" value={newTrainer.email} onChange={handleInputChange} required />
                    <Input id="password" label="Contraseña Temporal" type="password" value={newTrainer.password} onChange={handleInputChange} required />
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