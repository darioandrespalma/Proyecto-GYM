import apiClient from './apiClient';

export const getPayments = async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
    });
    
    const response = await apiClient.get(`/api/v1/admin/payments?${params}`);
    return response.data;
};

export const getPayment = async (paymentId) => {
    const response = await apiClient.get(`/api/v1/admin/payments/${paymentId}`);
    return response.data;
};

export const updatePaymentStatus = async (paymentId, status) => {
    const response = await apiClient.put(`/api/v1/admin/payments/${paymentId}`, {
        status: status
    });
    return response.data;
};

export const getPaymentsByStatus = async (status) => {
    const response = await apiClient.get(`/api/v1/admin/payments/status/${status}`);
    return response.data;
};

export const createPayment = async (paymentData) => {
    const formData = new FormData();
    
    // Añadir datos básicos
    formData.append('membership_type', paymentData.membership_type);
    formData.append('payment_method', paymentData.payment_method);
    formData.append('amount', paymentData.amount);
    
    // Añadir comprobante si existe
    if (paymentData.comprobante) {
        formData.append('comprobante', paymentData.comprobante);
    }
    
    const response = await apiClient.post('/api/v1/member/payments', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const getMyPayments = async () => {
    const response = await apiClient.get('/api/v1/member/payments');
    return response.data;
};

export const getPaymentMethods = async () => {
    try {
        const response = await apiClient.get('/api/v1/member/payments/methods');
        return response;
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        // Devolver métodos por defecto en caso de error
        return {
            data: [
                {
                    value: "credit_card",
                    label: "Tarjeta de Crédito/Débito",
                    description: "Pago seguro con tarjeta (procesamiento inmediato)"
                },
                {
                    value: "bank_transfer",
                    label: "Transferencia Bancaria", 
                    description: "Transfiere desde tu banco y sube el comprobante"
                },
                {
                    value: "cash",
                    label: "Efectivo",
                    description: "Paga directamente en recepción"
                }
            ]
        };
    }
};
// Alias para approvePayment (manteniendo compatibilidad con tu código existente)
export const approvePayment = async (paymentId) => {
    return updatePaymentStatus(paymentId, 'completed');
};