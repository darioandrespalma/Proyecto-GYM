import apiClient from './apiClient';

/**
 * Obtiene la lista de todos los entrenadores desde el backend.
 * Necesita el token de autenticación en la cabecera.
 */
export const getTrainers = async () => {
    const response = await apiClient.get('/api/v1/admin/trainers/');
    return response.data;
};

/**
 * Envía los datos de un nuevo entrenador al backend para crearlo.
 * @param {object} trainerData - Los datos del entrenador (nombre, email, etc.).
 */
export const createTrainer = async (trainerData) => {
    const response = await apiClient.post('/api/v1/admin/trainers/', trainerData);
    return response.data;
};
