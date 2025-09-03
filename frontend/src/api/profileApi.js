// frontend/src/api/profileApi.js (ARCHIVO NUEVO)
import apiClient from './apiClient';

/**
 * Obtiene los datos del perfil del usuario logueado.
 */
export const getMyProfile = async () => {
    const response = await apiClient.get('/api/v1/profile/me');
    return response.data;
};

/**
 * Actualiza los datos del perfil del usuario, incluyendo la foto.
 * @param {FormData} profileData - FormData object con full_name, phone, y profile_picture.
 */
export const updateMyProfile = async (profileData) => {
    const response = await apiClient.put('/api/v1/profile/me', profileData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};