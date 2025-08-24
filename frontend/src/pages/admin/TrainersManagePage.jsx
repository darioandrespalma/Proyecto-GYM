import React, { useState, useEffect } from 'react';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';
// --- CAMBIO 1: Importar las funciones de la API ---
import { getTrainers, createTrainer } from '../../api/trainersApi';

const TrainersManagePage = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estado para manejar los datos del formulario del nuevo entrenador
    const [newTrainer, setNewTrainer] = useState({
        full_name: '',
        email: '',
        password: '',
        role: 'trainer' // El rol se envía directamente
    });

    // --- CAMBIO 2: Usar useEffect para llamar a la API al cargar la página ---
    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                // Ya no usamos mockData, llamamos a la API real
                const data = await getTrainers();
                setTrainers(data);
            } catch (error) {
                console.error("Error al obtener los entrenadores:", error);
                // Aquí podrías mostrar un mensaje de error al usuario
            } finally {
                setLoading(false);
            }
        };

        fetchTrainers();
    }, []); // El array vacío asegura que se ejecute solo una vez

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Limpiar el formulario al cerrar
        setNewTrainer({ full_name: '', email: '', password: '', role: 'trainer' });
    };

    const handleInputChange = (e) => {
        setNewTrainer({ ...newTrainer, [e.target.id]: e.target.value });
    };

    // --- CAMBIO 3: Función para guardar el nuevo entrenador llamando a la API ---
    const handleSaveTrainer = async (e) => {
        e.preventDefault();
        try {
            const createdTrainer = await createTrainer(newTrainer);
            // Añadir el nuevo entrenador a la lista sin tener que recargar la página
            setTrainers([...trainers, createdTrainer]);
            handleCloseModal();
        } catch (error) {
            console.error("Error al crear el entrenador:", error);
            // Aquí podrías mostrar un error en el modal
        }
    };

    const columns = [
        { Header: 'Nombre Completo', accessor: 'full_name' },
        { Header: 'Email', accessor: 'email' },
        // Puedes añadir más columnas si las tienes en tu modelo, como 'specialty'
        {
            Header: 'Acciones',
            accessor: 'id',
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Button color="secondary">Editar</Button>
                    <Button color="danger">Eliminar</Button>
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
