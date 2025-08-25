import React, { useState, useEffect } from 'react';
import Table from '../../components/common/Table';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { getPayments, approvePayment } from '../../api/paymentsApi'; // Asegúrate de tener este archivo

const PaymentsListPage = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const data = await getPayments();
            setPayments(data);
        } catch (error) {
            console.error("Error al obtener los pagos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleApprovePayment = async (paymentId) => {
        try {
            await approvePayment(paymentId);
            // Refrescar la lista de pagos para mostrar el cambio de estado
            fetchPayments();
        } catch (error) {
            console.error("Error al aprobar el pago:", error);
        }
    };
    
    const columns = [
        // El backend devuelve el objeto 'user' anidado, así que accedemos a 'user.full_name'
        { Header: 'Usuario', accessor: 'user', Cell: ({ row }) => row.user.full_name },
        { Header: 'Monto', accessor: 'amount', Cell: ({ row }) => `$${row.amount.toFixed(2)}` },
        { Header: 'Método', accessor: 'payment_method' },
        { Header: 'Fecha', accessor: 'date', Cell: ({ row }) => new Date(row.date).toLocaleDateString() },
        { Header: 'Estado', accessor: 'status', Cell: ({ row }) => <StatusBadge status={row.status} /> },
        {
            Header: 'Acciones',
            accessor: 'id',
            Cell: ({ row }) => (
                row.status === 'pending' ? (
                    <Button color="primary" onClick={() => handleApprovePayment(row.id)}>
                        Aprobar
                    </Button>
                ) : null
            ),
        },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Pagos</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {loading ? <Spinner /> : <Table columns={columns} data={payments} />}
            </div>
        </div>
    );
};

export default PaymentsListPage;
