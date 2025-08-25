import React, { useEffect, useState } from 'react';
import { getMembers } from '../../api/membersApi';
import Table from '../../components/common/Table';
import Spinner from '../../components/common/Spinner';
import StatusBadge from '../../components/common/StatusBadge';

const MembersListPage = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const data = await getMembers();
                setMembers(data);
            } catch (error) {
                console.error("Error al obtener los miembros:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    const columns = [
        { Header: 'Nombre Completo', accessor: 'full_name' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Teléfono', accessor: 'phone' },
        { Header: 'Estado Membresía', accessor: 'membership_status', Cell: ({ row }) => <StatusBadge status={row.membership_status} /> },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Miembros</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {loading ? <Spinner /> : <Table columns={columns} data={members} />}
            </div>
        </div>
    );
};

export default MembersListPage;