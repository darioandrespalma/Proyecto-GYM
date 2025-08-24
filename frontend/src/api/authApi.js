import apiClient from './apiClient';

export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await apiClient.post('/api/v1/auth/token', formData);
  return response.data;
};