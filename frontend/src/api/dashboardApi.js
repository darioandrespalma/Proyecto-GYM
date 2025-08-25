import apiClient from './apiClient';

/**
 * Obtiene todas las estadísticas y la actividad reciente para el dashboard del admin.
 */
export const getDashboardData = async () => {
    const response = await apiClient.get('/api/v1/admin/dashboard/');
    return response.data;
};
