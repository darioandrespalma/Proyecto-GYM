import React, { useState, useEffect } from 'react';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const PaymentsListPage = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simula la carga de datos de la API
    useEffect(() => {
        const mockData = [
            { id: 1, user_name: 'Juan Pérez', amount: 49.99, status: 'completed', method: 'Credit Card', date: '2025-08-20' },
            { id: 2, user_name: 'Ana Martínez', amount: 49.99, status: 'pending', method: 'Bank Transfer', date: '2025-08-21' },
            { id: 3, user_name: 'Carlos Sanchez', amount: 120.00, status: 'completed', method: 'Debit Card', date: '2025-08-19' },
            { id: 4, user_name: 'Laura Gómez', amount: 49.99, status: 'rejected', method: 'Credit Card', date: '2025-08-18' },
        ];
        setTimeout(() => {
            setPayments(mockData);
            setLoading(false);
        }, 1000); // Simula un retraso de red
    }, []);

    // Función para manejar la aprobación de un pago
    const handleApprovePayment = (paymentId) => {
        setPayments(prevPayments =>
            prevPayments.map(p =>
                p.id === paymentId ? { ...p, status: 'completed' } : p
            )
        );
        // Aquí iría la llamada a la API para actualizar el estado en el backend
    };
    
    // Definición de las columnas para la tabla reutilizable
    const columns = [
        { Header: 'Usuario', accessor: 'user_name' },
        { Header: 'Monto', accessor: 'amount', Cell: ({ value }) => `$${value.toFixed(2)}` },
        { Header: 'Método', accessor: 'method' },
        { Header: 'Fecha', accessor: 'date' },
        { Header: 'Estado', accessor: 'status', Cell: ({ value }) => <StatusBadge status={value} /> },
        {
            Header: 'Acciones',
            accessor: 'id',
            Cell: ({ value, row: { original } }) => (
                original.status === 'pending' ? (
                    <Button color="primary" onClick={() => handleApprovePayment(value)}>
                        Aprobar
                    </Button>
                ) : null
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Pagos</h1>
                {/* Un botón para agregar pagos manualmente si es necesario */}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {loading ? <Spinner /> : <Table columns={columns} data={payments} />}
            </div>
        </div>
    );
};

export default PaymentsListPage;