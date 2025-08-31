// Frontend/src/api/authApi.js
// --- REEMPLAZA TU ARCHIVO CON ESTE CÓDIGO ---

import apiClient from './apiClient';

/**
 * Envía las credenciales de inicio de sesión al backend.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} La respuesta del servidor con el access_token.
 */
export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  // No usamos try/catch aquí para que el error pueda ser manejado por el componente que llama
  const response = await apiClient.post('/api/v1/auth/token', formData);
  return response.data;
};

// ... (puedes mantener tu función registerUser aquí si la usas)

// --- FUNCIÓN NUEVA AÑADIDA ---
export const registerUser = async (userData) => {
    // El backend espera 'full_name', no 'fullName'
    const payload = {
        full_name: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        role: 'member' // El rol se define aquí o en el backend
    };
    const response = await apiClient.post('/api/v1/auth/register', payload);
    return response.data;
};
