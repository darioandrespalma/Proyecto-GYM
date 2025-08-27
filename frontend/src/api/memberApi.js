// frontend/src/api/memberApi.js (NUEVO ARCHIVO)

import apiClient from './apiClient';

// --- Dashboard ---
export const getMemberDashboard = () => {
  return apiClient.get('/api/v1/member/dashboard');
};

// --- Schedule ---
export const getSchedule = () => {
  return apiClient.get('/api/v1/member/schedule');
};

export const bookClass = (classId) => {
  return apiClient.post(`/api/v1/member/schedule/book/${classId}`);
};

export const cancelBooking = (classId) => {
  return apiClient.delete(`/api/v1/member/schedule/cancel/${classId}`);
};

// --- Memberships ---
export const getMembershipPlans = () => {
    return apiClient.get('/api/v1/member/memberships');
};