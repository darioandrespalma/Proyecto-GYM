import apiClient from './apiClient';

export const getPayments = async () => {
    const response = await apiClient.get('/api/v1/admin/payments/');
    return response.data;
};

export const approvePayment = async (paymentId) => {
    const response = await apiClient.put(`/api/v1/admin/payments/${paymentId}`, {
        status: 'completed'
    });
    return response.data;
};
