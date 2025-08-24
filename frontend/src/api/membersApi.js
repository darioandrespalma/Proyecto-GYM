import apiClient from './apiClient';

export const getMembers = async () => {
  const response = await apiClient.get('/api/v1/admin/members');
  return response.data;
};