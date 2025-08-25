import apiClient from './apiClient';

export const getClasses = async () => {
    const response = await apiClient.get('/api/v1/admin/classes/');
    return response.data;
};

// --- FUNCIÓN NUEVA AÑADIDA ---
export const createClass = async (classData) => {
    const response = await apiClient.post('/api/v1/admin/classes/', classData);
    return response.data;
};
