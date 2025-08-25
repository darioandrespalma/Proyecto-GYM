import apiClient from './apiClient';

export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await apiClient.post('/api/v1/auth/token', formData);
  return response.data;
};

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
