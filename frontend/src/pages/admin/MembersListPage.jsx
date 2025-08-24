import React, { useEffect, useState } from 'react';
// import { getMembers } from '../../api/membersApi'; // Descomentar cuando la API esté lista
import StatusBadge from '../../components/common/StatusBadge';

const MembersListPage = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulación de llamada a la API
        const fetchMembers = async () => {
            // const data = await getMembers(); // Llamada real a la API
            const mockData = [
                { id: 1, full_name: 'Dario Palma', email: 'dario@email.com', phone: '0987654321', membership_status: 'active', registration_date: new Date() },
                { id: 2, full_name: 'Juan Pérez', email: 'juan.perez@email.com', phone: '0912345678', membership_status: 'inactive', registration_date: new Date() },
            ];
            setMembers(mockData);
            setLoading(false);
        };
        fetchMembers();
    }, []);

    if (loading) return <p className="text-center mt-8">Cargando miembros...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Miembros</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {/* Aquí iría la tabla */}
                <p>Tabla de miembros irá aquí.</p>
            </div>
        </div>
    );
};

export default MembersListPage;