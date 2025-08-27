// frontend/src/api/trainerApi.js

import apiClient from './apiClient';

// Obtiene las clases asignadas al entrenador logueado
export const getTrainerClasses = () => {
  // ANTES: return apiClient.get('/trainer/my-classes');
  // AHORA:
  return apiClient.get('/api/v1/trainer/my-classes');
};

// Obtiene los miembros inscritos en una clase específica
export const getClassMembers = (classId) => {
  // ANTES: return apiClient.get(`/trainer/class/${classId}/members`);
  // AHORA:
  return apiClient.get(`/api/v1/trainer/class/${classId}/members`);
};